ROOT := $(shell pwd)

.PHONY: all serve clean install-pkg build-ui

all: install-pkg build-ui

serve:
	@cd $(ROOT)/server && . venv/bin/activate && uvicorn main:app --reload

clean:
	@$(RM) -r $(ROOT)/server/templates $(ROOT)/ui/build

install-pkg:
	@if [ ! -d "$(ROOT)/server/venv" ]; then \
		cd $(ROOT)/server && \
			python3 -m venv venv && \
			. venv/bin/activate && \
			pip3 install fastapi jinja2 python-multipart uvicorn; \
	fi
	@if [ ! -d "$(ROOT)/ui/node_modules" ]; then \
		cd $(ROOT)/ui && yarn install; \
	fi

build-ui:
	@if [ ! -d "$(ROOT)/ui/build" ]; then \
		cd $(ROOT)/ui && yarn build; \
	fi

	@if [ ! -d "$(ROOT)/server/templates" ]; then \
		mkdir $(ROOT)/server/templates; \
		ln -s $(ROOT)/ui/build/* $(ROOT)/server/templates; \
	fi
