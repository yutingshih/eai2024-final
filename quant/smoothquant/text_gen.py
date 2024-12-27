import argparse
import os
import sys
import time
from packaging.version import Version
from pathlib import Path

import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, LlamaForCausalLM
from datasets import load_dataset
from smoothquant.fake_quant import W8A8Linear


os.environ["CUDA_DEVICE_ORDER"] = "PCI_BUS_ID"
os.environ["CUDA_VISIBLE_DEVICES"] = "1"


def parse_args():
    parser = argparse.ArgumentParser(
        formatter_class=argparse.ArgumentDefaultsHelpFormatter
    )
    parser.add_argument(
        "--model",
        default="../../weights/smoothquant/llama2-smooth-w8a8.hf",
        help="Path to the PyTorch model to be evaluated",
    )
    parser.add_argument(
        "-f", "--format", choices=["pt", "hf"], default="hf", help="Format of the model"
    )
    parser.add_argument(
        "--tokenizer",
        default="../../weights/meta-llama/Llama-2-7b-hf",
        help="Directory to the tokenizer",
    )
    parser.add_argument(
        "--prompt", required=True, help="Prompt text for text generation"
    )
    parser.add_argument(
        "--max_length",
        type=int,
        default=100,
        help="Maximum length of the generated text",
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


def generate_text(model, tokenizer, prompt, max_length, device):
    inputs = tokenizer(prompt, return_tensors="pt").to(device)
    start_time = time.time()
    outputs = model.generate(
        inputs.input_ids,
        max_length=max_length,
        num_return_sequences=1,
        do_sample=True,
        top_k=50,
        top_p=0.95,
    )
    inference_time = time.time() - start_time
    print(f"Inference Time: {inference_time:.2f} seconds")
    return tokenizer.decode(outputs[0], skip_special_tokens=True), inference_time


def main():
    args = parse_args()
    os.makedirs(os.path.dirname(os.path.abspath(args.model)), exist_ok=True)
    device = torch.device(
        "cuda"
        if torch.cuda.is_available()
        else "mps" if torch.backends.mps.is_available() else "cpu"
    )
    print(
        f"Using device: {torch.cuda.get_device_name(0) if device.type == 'cuda' else 'MPS' if device.type == 'mps' else 'CPU'}"
    )

    W8A8Linear.nop = lambda self, x: x
    tokenizer = AutoTokenizer.from_pretrained(args.tokenizer)
    print("loaded tokenizer")

    if args.format == "pt":
        if Version(torch.__version__) >= Version("2.0.0"):
            model = torch.load(args.model, weights_only=False, map_location="cpu")
        else:
            model = torch.load(args.model, map_location=device)
    elif args.format == "hf":
        model = AutoModelForCausalLM.from_pretrained(
            args.model, torch_dtype=torch.float16, device_map="auto"
        )
    else:
        raise ValueError(f"Unknown format {args.format}")
    model = model.to(device)

    print(f"Model loaded from {args.model}")
    if args.verbose:
        print(model)
    print("loaded model")

    generated_text, inference_time = generate_text(
        model, tokenizer, args.prompt, args.max_length, device
    )
    print(f"\nGenerated Text:\n{generated_text}")
    print(f"\nInference Time: {inference_time:.2f} seconds")


if __name__ == "__main__":
    main()
