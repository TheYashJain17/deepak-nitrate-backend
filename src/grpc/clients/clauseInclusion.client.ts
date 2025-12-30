import grpc from "@grpc/grpc-js";

import protoLoader from "@grpc/proto-loader";

import path from "path";

const PROTO_PATH = path.join(process.cwd(), "src/grpc/proto/clauseInclusion.proto");

const packageDef = protoLoader.loadSync(PROTO_PATH);

const clauseInclusionObj = grpc.loadPackageDefinition(packageDef) as any;

const clauseInclusionClient = clauseInclusionObj.clauseInclusion.ClauseInclusionService("0.0.0.0:50051", grpc.credentials.createInsecure());

export default clauseInclusionClient;