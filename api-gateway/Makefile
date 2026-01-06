NODE = node
PNPM = pnpm

.PHONY: install start build 

install:
	$(PNPM) install


start:
	$(PNPM) start

build:
	$(PNPM) run build

docker:
	sudo docker compose down && sudo docker compose up --build

