import argparse
import os
from packaging.version import Version
from pathlib import Path
import time
from types import MethodType

import torch
from transformers.models.llama.modeling_llama import LlamaForCausalLM
from smoothquant.smooth import smooth_lm
from smoothquant.fake_quant import quantize_llama_like, W8A8Linear


os.environ["CUDA_DEVICE_ORDER"] = "PCI_BUS_ID"
os.environ["CUDA_VISIBLE_DEVICES"] = "1"


def parse_args():
    parser = argparse.ArgumentParser(
        formatter_class=argparse.ArgumentDefaultsHelpFormatter
    )
    parser.add_argument(
        "-i",
        "--model",
        default="../../weights/meta-llama/Llama-2-7b-hf",
        help="Directory to the tokenizer and the model and to be quantized",
    )
    parser.add_argument(
        "--act_scales",
        default="../../weights/act_scales/llama-2-7b.pt",
        help="Path to the activation scales (*.pt)",
    )
    parser.add_argument(
        "-o",
        "--save_path",
        default=f"../../weights/smoothquant-{time.strftime('%m%d')}/llama2",
        help="Path to save the quantized model",
    )
    parser.add_argument(
        "-f",
        "--format",
        choices=["pt", "hf", "all"],
        default="all",
        help="Format to save the quantized model",
    )
    parser.add_argument(
        "--action",
        choices=["smooth", "quantize"],
        default="quantize",
        help="Action to perform",
    )
    parser.add_argument(
        "--alpha",
        type=float,
        default=0.5,
        help="Alpha value for the smooth quantization",
    )
    parser.add_argument(
        "-g",
        "--gpu",
        type=int,
        default=0,
        help="GPU index to use for the evaluation",
    )
    parser.add_argument(
        "-v", "--verbose", action="store_true", help="Show more information"
    )
    args = parser.parse_args()

    if not os.path.isdir(args.model):
        raise ValueError(f"--model argument should be a directory. got {args.model}")
    if not os.path.isfile(args.act_scales):
        raise ValueError(
            f"--act_scales argument should be a file. got {args.act_scales}"
        )

    return args

def smooth(
    model_path: str | Path, act_scales_path: str, alpha: float = 0.5
) -> torch.nn.Module:
    model_fp16 = LlamaForCausalLM.from_pretrained(
        model_path, torch_dtype=torch.float16, device_map="auto"
    )
    if Version(torch.__version__) >= Version("2.0.0"):
        act_scales = torch.load(act_scales_path, weights_only=False)
    else:
        act_scales = torch.load(act_scales_path)
    print(f"smoothing with {alpha=}")
    smooth_lm(model_fp16, act_scales, alpha)
    return model_fp16


def quantize(
    model_path: str | Path, act_scales_path: str, alpha: float = 0.5
) -> torch.nn.Module:
    model_fp16 = smooth(model_path, act_scales_path, alpha)
    model_int8 = quantize_llama_like(model_fp16)
    return model_int8


def make_pickleable(model: torch.nn.Module) -> torch.nn.Module:
    def nop(self, x):
        return x

    W8A8Linear.nop = nop
    for name, module in model.named_modules():
        if isinstance(module, W8A8Linear) and module.output_quant_name == "None":
            module.output_quant = MethodType(nop, module)
    return model


def main():
    args = parse_args()
    os.environ["CUDA_VISIBLE_DEVICES"] = str(args.gpu)

    save_path = Path(args.save_path)
    save_path.parent.mkdir(parents=True, exist_ok=True)

    match args.action:
        case "smooth":
            model = smooth(args.model, args.act_scales, args.alpha)
        case "quantize":
            model = quantize(args.model, args.act_scales, args.alpha)
        case _:
            raise ValueError(f"Unknown action {args.action}")

    if args.verbose:
        print(model)

    model = make_pickleable(model)

    if args.format == "all":
        torch.save(model, save_path.with_suffix(".pt"))
        model.save_pretrained(save_path.with_suffix(".hf"))
    elif args.format == "pt":
        torch.save(model, save_path.with_suffix(".pt"))
    elif args.format == "hf":
        model.save_pretrained(save_path.with_suffix(".hf"))
    else:
        raise ValueError(f"Unknown format {args.format}")
    print(f"Quantized model saved at {save_path}")


if __name__ == "__main__":
    main()
