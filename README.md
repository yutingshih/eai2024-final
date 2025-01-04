# eai2024-final
Final Project of EAI 2024 Fall

# Prerequisites

- frontend
    - Nodejs
    - npm
    - yarn

- backend
    - conda (anaconda / miniconda)

# Quick start

## Activate backend

First, create the virtual environment using `conda`

```shell
# create new virtual environment if it is not existing
$ conda create -y --name "<your-env-name>"
# otherwise, activate it
$ conda activate "<your-env-name>"
```

Then, install the dependencies

```shell
$ pip install \
    huggingface-hub==0.26.2 \
    mlx==0.21.0 \
    mlx-lm==0.20.1 \
    coremltools==8.1
```

Finally, run with `MLX` server

```shell
$ mlx_lm.server --model "<your-model-path>"
```

## Activate frontend

In `eai2024-final` directory, run the following commands to run the frontend server:

```shell
$ make install-packages
$ make start-ui
```

The page can be seen at http://localhost:3000
