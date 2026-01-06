import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.join(process.cwd(), "src/grpc/proto/zkpVerification.proto"); //this is for the local
// const PROTO_PATH = path.join(__dirname, "../../../../proto/zkpVerification.proto"); //this is for the production as per our dockerfile
const packageDef = protoLoader.loadSync(PROTO_PATH);
const clauseInclusionObj = grpc.loadPackageDefinition(packageDef);
const clauseInclusionClient = new clauseInclusionObj.zkpVerification.ZKPVerificationService("0.0.0.0:50051", grpc.credentials.createInsecure()); //this is for local
// const clauseInclusionClient = new clauseInclusionObj.zkpVerification.ZKPVerificationService("zkp-verification-service:50051", grpc.credentials.createInsecure()); //this is for prod
export default clauseInclusionClient;
