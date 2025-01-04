ROOT := $(shell pwd)

.PHONY: all
all: install-packages

CONDA := $(shell which conda)

ifeq ($(CONDA),)
    $(error Conda is not installed.)
else
    VENV := $(shell conda env list | grep eai-final-2024-fall)
endif

ifeq ($(VENV),)
    $(warning No existing virtual environment found. Now creat a new one ("eai-final-2025-fall"))
    $(shell conda create --name eai-final-2024-fall python=3.10)
endif

MODEL ?=

ifeq ($(MODEL),)
    $(error Please specify the path to the model)
endif

.PHONY: check-tools
check-tools:
	@if ! command -v node &>/dev/null; then \
		echo "Error: Node.js is not installed. Please install Node.js (e.g., with Homebrew: brew install node)."; \
		exit 1; \
	fi
	@if ! command -v npm &>/dev/null; then \
		echo "Error: npm is not installed. Please ensure npm is installed with Node.js."; \
		exit 1; \
	fi
	@if ! command -v yarn &>/dev/null; then \
		echo "Error: Yarn is not installed. Please install Yarn (e.g., with npm: npm install -g yarn or Homebrew: brew install yarn)."; \
		exit 1; \
	fi

.PHONY: install-packages
install-packages: check-tools
	@if [ ! -d "$(ROOT)/ui/node_modules" ]; then \
		cd "$(ROOT)/ui" && yarn install; \
	fi
	. ~/anaconda3/bin/activate eai-final-2024-fall && \
		pip install \
			huggingface-hub==0.26.2 \
			mlx==0.21.0 \
			mlx-lm==0.20.1 \
			coremltools==8.1
	@cd "$(ROOT)/ui && yarn build

.PHONY: start-server
start-server:
	@. ~/anaconda3/bin/activate eai-final-2024-fall && \
		mlx_lm.server --model "$(MODEL)"

.PHONY: start-ui
start-ui:
	@cd "$(ROOT)/ui" && yarn run start

.PHONY: distclean
distclean:
	@$(RM) -r "$(ROOT)/ui/node_modules"
