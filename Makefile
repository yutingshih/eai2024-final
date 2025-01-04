ROOT := $(shell pwd)

.PHONY: all
all: start-ui

CONDA := $(shell which conda)

ifeq ($(CONDA),)
    $(error Conda is not installed.)
endif

ifeq ($(VENV),)
    $(error No existing virtual environment found. Now creat a new one ("eai-final-2024-fall"))
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
		cd "$(ROOT)/ui" && yarn install && yarn build; \
	fi

.PHONY: start-ui
start-ui: install-packages
	@cd "$(ROOT)/ui" && yarn run start

.PHONY: distclean
distclean:
	@$(RM) -r "$(ROOT)/ui/node_modules"
	@$(RM) -r "$(ROOT)/.next"
