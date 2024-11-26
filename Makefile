ROOT := $(shell pwd)

.PHONY: all serve clean install-pkg build-ui check-tools

all: check-tools install-pkg build-ui

serve:
	@cd "$(ROOT)/server" && . venv/bin/activate && uvicorn main:app --reload

clean:
	@$(RM) -r "$(ROOT)/server/templates" "$(ROOT)/ui/build"

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

build-ui:
	@if [ ! -d "$(ROOT)/ui/build" ]; then \
		cd "$(ROOT)/ui" && yarn build; \
	fi

	@if [ ! -d "$(ROOT)/server/templates" ]; then \
		mkdir "$(ROOT)/server/templates"; \
		ln -s "$(ROOT)/ui/build/"* "$(ROOT)/server/templates"; \
	fi
