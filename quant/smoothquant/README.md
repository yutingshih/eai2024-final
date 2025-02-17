# SmoothQuant for Llama

## Getting Started

Create a virtual environment via `venv` or `conda`. Note that Python 3.10

```shell
# Using conda
conda create -n eai python=3.10 -y
conda activate eai
```

```shell
# Using venv
python3 -m venv venv
source ./venv/bin/activate
```

Install dependency packages based on your environement.

```shell
# For CUDA
pip install -r requirements/cuda.txt

# For MPS
pip install -r requirements/mps.txt

# For CPU-only
pip install -r requirements/cpu.txt
```

## Download Pretrained Weights

We have provided a shell script [`scripts/nas.sh`](../../scripts/nas.sh) for downloading/uploading files or directories from/to [AISLab NAS](https://aislabnas.ee.ncku.edu.tw). Use the following command to download pretrained weights.

```shell
./scripts/nas.sh download weights
```

The directory structure would be as follows:

```
eai2024-final
└── weights
    ├── act_scales
    │   ├── llama-2-7b.pt
    │   ├── llama-3.1-8b.pt
    │   └── README.md
    ├── meta-llama
    │   ├── Llama-2-7b-hf
    │   └── Llama-3.1-8B-Instruct
    └── smoothquant-1226
        ├── llama2-smooth-w8a8.hf
        └── llama2-smooth-w8a8.pt
```

The latest smoothed Llama2 weights is in `weights/smoothquant-0105/`, and the latest smoothed Llama3 weights is in `weights/smoothquant-0103/`.

## Quantize FP16 Model to INT8

Before quantizing the model, make sure you have already run the [`generate_act_scales.py`](./generate_act_scales.py) to generate the activation scales or download it from AISLab NAS.

```shell
python3 quant.py --model ${FP16_MODEL} --act_scales ${ACT_SCALES} --save_path ${INT8_MODEL}
```

## Evaluation with WikiText-2

Load the full-precision model and run evaluation.

```shell
python3 test.py --model ${FP16_MODEL} --tokenizer ${TOKENIZER} --format "hf"
```

Load the quantized model in HuggingFace format and run evaluation.

```shell
python3 test.py --model ${INT8_HF_MODEL} --tokenizer ${TOKENIZER} -q --format "hf"
```

Load the quantized model in HuggingFace format and run evaluation.

```shell
python3 test.py --model ${INT8_PT_MODEL} --tokenizer ${TOKENIZER} -q --format "pt"
```

## Text Generation

```shell
python3 text_gen.py --model ${INT8_HF_MODEL} --tokenizer ${TOKENIZER} --format "hf" --prompt "What is AI?"
```
