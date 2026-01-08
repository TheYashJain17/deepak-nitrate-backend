NODE = node
PNPM = pnpm

.PHONY: install start build dev

install:
	$(PNPM) install


start:
	$(PNPM) start

build:
	$(PNPM) run build

dev:
	$(PNPM) run dev

docker:
	sudo docker compose down && sudo docker compose up --build

