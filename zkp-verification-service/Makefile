NODE = node 
PNPM = pnpm 

.PHONY: install start dev build docker proto

install:
	$(PNPM) install

start:
	$(PNPM) start

dev:
	$(PNPM) run dev 

build:
	$(PNPM) run build

proto:
	protoc \
  -I ${PWD}/proto \
  --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts_proto \
  --ts_out="esModuleInterop=true,outputServices=grpc-js,outputClientImpl=true,forceLong=false,useOptionals=true:${PWD}/src/protoOutput" \
  ${PWD}/proto/zkpVerification.proto

docker:
	docker compose down && docker compose up --build