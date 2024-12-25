import argparse
import os
import sys

# project_root = os.path.dirname(os.path.abspath(__file__))
# sys.path.append(os.path.join(project_root, "smoothquant"))
# os.environ["CUDA_DEVICE_ORDER"] = "PCI_BUS_ID"
# os.environ["CUDA_VISIBLE_DEVICES"] = "1"

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

import tqdm

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
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--model",
        default="../../weights/smoothquant/llama2-smooth-w8a8.pt",
        help="Path to the PyTorch model to be evaluated (*.pt)",
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
        "-v", "--verbose", action="store_true", help="Show more information"
    )
    args = parser.parse_args()

    if args.quantized and not os.path.isfile(args.model):
        raise ValueError(f"--model argument should be a file. got {args.model}")
    elif not args.quantized and not os.path.isdir(args.model):
        raise ValueError(f"--model argument should be a directory. got {args.model}")

    if not os.path.isdir(args.tokenizer):
        raise ValueError(
            f"--tokenizer argument should be a directory. got {args.tokenizer}"
        )

    return args


def evaluate_fp16_model(model_path: str, evaluator: Evaluator) -> float:
    model = LlamaForCausalLM.from_pretrained(
        model_path, torch_dtype=torch.float16, device_map="auto"
    )

    print(f"Model loaded from {model_path}")
    if verbose:
        print(model)

    ppl = evaluator.evaluate(model)
    print(f"FP16 model perplexity: {ppl}")
    return ppl


def evaluate_int8_model(model_path: str, evaluator: Evaluator) -> float:
    W8A8Linear.nop = lambda self, x: x

    # you need to map the model to the CPU first instead of directly loading it onto the MPS device
    model = torch.load(model_path, weights_only=False, map_location=torch.device("cpu"))
    model = model.to(DEVICE)

    print(f"Model loaded from {model_path}")
    if verbose:
        print(model)

    ppl = evaluator.evaluate(model)
    print(f"SmoothQuant W8A8 quantized model perplexity: {ppl}")
    return ppl


def main():
    args = parse_args()
    global verbose
    verbose = args.verbose

    print(
        f"Using device: {torch.cuda.get_device_name(0) if DEVICE == 'cuda' else DEVICE.upper()}"
    )

    tokenizer = AutoTokenizer.from_pretrained(args.tokenizer)
    dataset = load_dataset("wikitext", "wikitext-2-raw-v1", split="test")
    evaluator = Evaluator(dataset, tokenizer, DEVICE)

    if args.quantized:
        evaluate_int8_model(model_path=args.model, evaluator=evaluator)
    else:
        evaluate_fp16_model(model_path=args.model, evaluator=evaluator)


if __name__ == "__main__":
    main()
