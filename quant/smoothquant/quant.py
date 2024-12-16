import argparse
import os
from types import MethodType

os.environ["CUDA_DEVICE_ORDER"] = "PCI_BUS_ID"
os.environ["CUDA_VISIBLE_DEVICES"] = "1"

import torch
from transformers.models.llama.modeling_llama import (
    LlamaAttention,
    LlamaDecoderLayer,
    LlamaForCausalLM,
    LlamaMLP,
)
from smoothquant.smooth import smooth_lm
from smoothquant.fake_quant import quantize_llama_like, W8A8Linear


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--model",
        default="../../weights/meta-llama/Llama-2-7b-hf",
        help="Directory to the tokenizer and the model and to be quantized",
    )
    parser.add_argument(
        "--act_scales",
        default="../../act_scales/llama-2-7b.pt",
        help="Path to the activation scales (*.pt)",
    )
    parser.add_argument(
        "--save_path",
        default="../../weights/smoothquant/llama2-smooth-w8a8.pt",
        help="Path to save the quantized model (*.pt)",
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


def quantize(model_path: str, act_scales_path: str) -> torch.nn.Module:
    model_fp16 = LlamaForCausalLM.from_pretrained(
        model_path, torch_dtype=torch.float16, device_map="auto"
    )
    act_scales = torch.load(act_scales_path)
    smooth_lm(model_fp16, act_scales, 0.85)
    model_int8 = quantize_llama_like(model_fp16)
    return model_int8


def make_pickleable(model: torch.nn.Module) -> torch.nn.Module:
    def nop(self, x):
        return x

    W8A8Linear.nop = nop
    for module in model.modules():
        if isinstance(module, W8A8Linear) and module.output_quant_name == "None":
            module.output_quant = MethodType(nop, module)
    return model


def main():
    args = parse_args()
    os.makedirs(os.path.dirname(os.path.abspath(args.save_path)), exist_ok=True)

    model_int8 = quantize(args.model, args.act_scales)
    if args.verbose:
        print(model_int8)

    model_int8 = make_pickleable(model_int8)

    torch.save(model_int8, args.save_path)
    print(f"Quantized model saved at {args.save_path}")


if __name__ == "__main__":
    main()
