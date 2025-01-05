import argparse
import time
import os
from packaging.version import Version
from pathlib import Path

import tqdm
import torch
from torch import nn
from transformers import (
    AutoTokenizer,
    AutoModelForCausalLM,
    LlamaTokenizer,
    LlamaForCausalLM,
)
from datasets import load_dataset
from smoothquant.fake_quant import W8A8Linear
import pandas as pd

os.environ["CUDA_DEVICE_ORDER"] = "PCI_BUS_ID"
os.environ["CUDA_VISIBLE_DEVICES"] = "1"

DEVICE = (
    "cuda"
    if torch.cuda.is_available()
    else "mps" if torch.backends.mps.is_available() else "cpu"
)


class Evaluator:
    def __init__(self, dataset, tokenizer, device, n_samples=40):
        self.dataset = dataset
        self.tokenizer = tokenizer
        self.device = device

        self.dataset = tokenizer(
            "\n\n".join(dataset["text"]), return_tensors="pt"
        ).input_ids.to(device)

        self.n_samples = n_samples

    @torch.no_grad()
    def evaluate(self, model):
        model.eval()
        nlls = []
        for i in tqdm.tqdm(range(self.n_samples), desc="Evaluating..."):
            batch = self.dataset[:, (i * 2048) : ((i + 1) * 2048)].to(model.device)
            with torch.no_grad():
                lm_logits = model(batch).logits
            shift_logits = lm_logits[:, :-1, :].contiguous().float()
            shift_labels = self.dataset[:, (i * 2048) : ((i + 1) * 2048)][:, 1:]
            loss_fct = nn.CrossEntropyLoss()
            loss = loss_fct(
                shift_logits.view(-1, shift_logits.size(-1)), shift_labels.view(-1)
            )
            neg_log_likelihood = loss.float() * 2048
            nlls.append(neg_log_likelihood)

        return torch.exp(torch.stack(nlls).sum() / (self.n_samples * 2048))


def parse_args():
    parser = argparse.ArgumentParser(
        formatter_class=argparse.ArgumentDefaultsHelpFormatter
    )
    parser.add_argument(
        "-i",
        "--model",
        default="../../weights/smoothquant/llama2-smooth-w8a8.pt",
        help="Path to the PyTorch model to be evaluated (*.pt)",
    )
    parser.add_argument(
        "-f",
        "--format",
        choices=["pt", "hf"],
        default="pt",
        help="Format to load the quantized model",
    )
    parser.add_argument(
        "--tokenizer",
        default="../../weights/meta-llama/Llama-2-7b-hf",
        help="Directory to the tokenizer",
    )
    parser.add_argument(
        "-q",
        "--quantized",
        action="store_true",
        help="Indicate if the model loaded is quantized",
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

    args.model = Path(args.model)
    args.tokenizer = Path(args.tokenizer)

    if args.format == "pt" and not args.model.is_file():
        raise ValueError(f"--model argument should be a file. got {args.model}")
    elif args.format == "hf" and not args.model.is_dir():
        raise ValueError(f"--model argument should be a directory. got {args.model}")

    if not args.tokenizer.is_dir():
        raise ValueError(
            f"--tokenizer argument should be a directory. got {args.tokenizer}"
        )

    return args


def load_fp16_model(path: str | Path, evaluator: Evaluator) -> float:
    model = LlamaForCausalLM.from_pretrained(
        path, torch_dtype=torch.float16, device_map="auto"
    )

    print(f"Model loaded from {path}")
    if verbose:
        print(model)

    return model


def load_int8_model(path: str | Path, evaluator: Evaluator, format: str) -> float:
    W8A8Linear.nop = lambda self, x: x

    # you need to map the model to the CPU first instead of directly loading it onto the MPS device
    if format == "pt":
        if Version(torch.__version__) >= Version("2.0.0"):
            model = torch.load(path, weights_only=False, map_location="cpu")
        else:
            model = torch.load(path, map_location="cpu")
    elif format == "hf":
        model = AutoModelForCausalLM.from_pretrained(
            path, torch_dtype=torch.float16, device_map="auto"
        )
    else:
        raise ValueError(f"Unknown format: {format}")
    model = model.to(DEVICE)

    print(f"Model loaded from {path}")
    if verbose:
        print(model)

    return model


def main():
    args = parse_args()
    global verbose
    verbose = args.verbose

    os.environ["CUDA_DEVICE_ORDER"] = "PCI_BUS_ID"
    os.environ["CUDA_VISIBLE_DEVICES"] = str(args.gpu)

    print(
        f"Using device: {torch.cuda.get_device_name(0) if DEVICE == f'cuda' else DEVICE.upper()}"
    )

    tokenizer = AutoTokenizer.from_pretrained(args.tokenizer)
    dataset = load_dataset("wikitext", "wikitext-2-raw-v1", split="test")
    evaluator = Evaluator(dataset, tokenizer, DEVICE)

    model_path = Path(args.model)

    if args.quantized:
        model = load_int8_model(
            path=args.model, evaluator=evaluator, format=args.format
        )
    else:
        model = load_fp16_model(path=args.model, evaluator=evaluator)

    ppl = evaluator.evaluate(model)
    print(f"perplexity: {ppl}")

    res = {
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        **vars(args),
        "perplexity": ppl.item(),
        "size": model_path.stat().st_size,
    }
    df = pd.DataFrame([res])

    # append the results to the results.csv
    if Path("results.csv").exists():
        df = pd.concat([pd.read_csv("results.csv"), df], ignore_index=True)
    df.sort_values("perplexity", inplace=True)
    df.to_csv("results.csv", index=False)

    # append the results to the README.md
    with open(f"{model_path.parent}/README.md", "a") as f:
        print(f"### {time.strftime('%Y-%m-%d %H:%M:%S')}", file=f)
        for k, v in vars(args).items():
            print(f"- {k}: `{v}`  ", file=f)
        print(f"- perplexity: `{ppl}`  ", file=f)
        print(file=f)


if __name__ == "__main__":
    main()
