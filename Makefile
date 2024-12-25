ROOT := $(shell pwd)

.PHONY: all
all: install-pkg

.PHONY: debug-server
debug-server: install-pkg
	@cd "$(ROOT)/server" && . venv/bin/activate && uvicorn main:app --reload

.PHONY: debug-ui
debug-ui: install-pkg
	@cd "$(ROOT)/ui" && yarn dev

.PHONY: serve
serve: build-ui
	@cd "$(ROOT)/server" && . venv/bin/activate && uvicorn main:app --reload 2>&1 &>/dev/null & echo $$! > "$(ROOT)/.uvicorn.pid"
	@cd "$(ROOT)/ui" && yarn start 2>&1 &>/dev/null & echo $$! > "$(ROOT)/.yarn.pid"

# might need to kill the background processor by youself
.PHONY: serve-terminate
serve-terminate:
	kill -9 `cat "$(ROOT)/.uvicorn.pid"`
	kill -9 `cat "$(ROOT)/.yarn.pid"`

.PHONY: clean
clean:
	@$(RM) -r "$(ROOT)/server/templates" "$(ROOT)/ui/build"

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

.PHONY: distclean
distclean:
	@$(RM) -r "$(ROOT)/ui/node_modules"

.PHONY: install-pkg
install-pkg:
	@if [ ! -d "$(ROOT)/server/venv" ]; then \
		cd "$(ROOT)/server" && \
			python3 -m venv venv && \
			. venv/bin/activate && \
			pip3 install pexpect fastapi jinja2 python-multipart uvicorn; \
	fi
	@if [ ! -d "$(ROOT)/ui/node_modules" ]; then \
		cd "$(ROOT)/ui" && yarn install; \
	fi

.PHONY: build-ui
build-ui: install-pkg
	@if [ ! -d "$(ROOT)/ui/build" ]; then \
		cd "$(ROOT)/ui" && yarn build; \
	fi
