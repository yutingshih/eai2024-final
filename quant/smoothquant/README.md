# SmoothQuant for Llama

```shell
pip install -r requirements.txt
```

## Quantize FP16 Model to INT8

Before quantizing the model, make sure you have already run the [`generate_act_scales.py`](./generate_act_scales.py) to generate the activation scales or download it from AISLab NAS.

```shell
python3 quant.py --model ${FP16_MODEL} --act_scales ${ACT_SCALES} --save_path ${INT8_MODEL}
```

## Load and Evaluate Quantized Model

Directly load the quantized model and run evaluation without re-quantize the full-precision model.

```shell
python3 test.py --model ${INT8_MODEL} --tokenizer ${TOKENIZER}
```
