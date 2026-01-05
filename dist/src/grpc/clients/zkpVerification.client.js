import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
const PROTO_PATH = path.join(process.cwd(), "src/grpc/proto/zkpVerification.proto");
const packageDef = protoLoader.loadSync(PROTO_PATH);
const clauseInclusionObj = grpc.loadPackageDefinition(packageDef);
const clauseInclusionClient = new clauseInclusionObj.zkpVerification.ZKPVerificationService("0.0.0.0:50051", grpc.credentials.createInsecure());
export default clauseInclusionClient;
