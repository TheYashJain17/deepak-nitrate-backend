NODE = node
PNPM = pnpm

.PHONY: install start build 

install:
	$(PNPM) install


start:
	$(PNPM) start

build:
	$(PNPM) run build

