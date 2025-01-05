DATE=$(date '+%m%d')

TOPDIR=$(dirname $(dirname $0))
echo "TOPDIR: $TOPDIR"

LLAMA2_MODEL=$TOPDIR/weights/meta-llama/Llama-2-7b-hf
LLAMA3_MODEL=$TOPDIR/weights/meta-llama/Llama-3.1-8B-Instruct
LLAMA2_SCALE=$TOPDIR/weights/act_scales/llama-2-7b.pt
LLAMA3_SCALE=$TOPDIR/weights/act_scales/llama-3.1-8b.pt

run_llama2() {
    ALPHA=${1:-0.5}
    OUTPUT_MODEL=$TOPDIR/weights/smoothquant-$DATE/llama2-$ALPHA/llama2-smooth-fp16.hf

    python3 quant.py -i $LLAMA2_MODEL --act_scales $LLAMA2_SCALE -o $OUTPUT_MODEL -f hf --action smooth --alpha $ALPHA -g 1
    python3 test.py -i $OUTPUT_MODEL -f hf --tokenizer $LLAMA2_MODEL -g 1 -o $TOPDIR/results/llama2.csv
}

run_llama3() {
    ALPHA=${1:-0.5}
    OUTPUT_MODEL=$TOPDIR/weights/smoothquant-$DATE/llama3-$ALPHA/llama3-smooth-fp16.hf

    python3 quant.py -i $LLAMA3_MODEL --act_scales $LLAMA3_SCALE -o $OUTPUT_MODEL -f hf --action smooth --alpha $ALPHA -g 1
    python3 test.py -i $OUTPUT_MODEL -f hf --tokenizer $LLAMA3_MODEL -g 1 -o $TOPDIR/results/llama3.csv
}

python3 test.py -i $LLAMA2_MODEL -f hf --tokenizer $LLAMA2_MODEL -g 1 -o $TOPDIR/results/llama2.csv
python3 test.py -i $LLAMA3_MODEL -f hf --tokenizer $LLAMA3_MODEL -g 1 -o $TOPDIR/results/llama3.csv

for ALPHA in 0.2 0.3 0.4 0.5 0.6 0.7 0.8; do
    run_llama2 $ALPHA
done

for ALPHA in 0.2 0.3 0.4 0.5 0.6 0.7 0.8; do
    run_llama3 $ALPHA
done
