NODE = node 
PNPM = pnpm 

.PHONY: start dev build docker 


start:
	$(PNPM) start

dev:
	$(PNPM) run dev 

build:
	$(PNPM) run build

docker:
	docker compose down && docker compose up --build