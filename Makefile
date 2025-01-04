ROOT := $(shell pwd)

.PHONY: all
all: start

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

.PHONY: start
start: install-packages
	# TODO: start llama as well
	@cd "$(ROOT)/ui" && yarn run build && yarn run start

.PHONY: distclean
distclean:
	@$(RM) -r "$(ROOT)/ui/node_modules"
