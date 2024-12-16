import argparse
import os

os.environ["CUDA_DEVICE_ORDER"] = "PCI_BUS_ID"
os.environ["CUDA_VISIBLE_DEVICES"] = "1"

import torch
from torch import nn
from transformers import AutoTokenizer
from datasets import load_dataset
from smoothquant.fake_quant import W8A8Linear
import tqdm


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
        "-v", "--verbose", action="store_true", help="Show more information"
    )
    args = parser.parse_args()

    if not os.path.isfile(args.model):
        raise ValueError(f"--model argument should be a file. got {args.model}")
    if not os.path.isdir(args.tokenizer):
        raise ValueError(
            f"--tokenizer argument should be a directory. got {args.tokenizer}"
        )

    return args


def main():
    args = parse_args()
    os.makedirs(os.path.dirname(os.path.abspath(args.model)), exist_ok=True)

    tokenizer = AutoTokenizer.from_pretrained(args.tokenizer)
    dataset = load_dataset("wikitext", "wikitext-2-raw-v1", split="test")
    evaluator = Evaluator(dataset, tokenizer, "cuda")

    W8A8Linear.nop = lambda self, x: x

    model = torch.load(args.model)
    print(f"Model loaded from {args.model}")
    if args.verbose:
        print(model)

    ppl = evaluator.evaluate(model)
    print(f"SmoothQuant W8A8 quantized model perplexity: {ppl}")


if __name__ == "__main__":
    main()
