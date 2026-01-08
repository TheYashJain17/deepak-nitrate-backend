NODE = node 
PNPM = pnpm 

.PHONY: install start dev build docker 

install:
	$(PNPM) install

start:
	$(PNPM) start

dev:
	$(PNPM) run dev 

build:
	$(PNPM) run build

docker:
	docker compose down && docker compose up --build