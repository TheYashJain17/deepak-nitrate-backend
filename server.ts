import grpc from "@grpc/grpc-js";

import protoLoader from "@grpc/proto-loader";
import path from "path";

import {fileURLToPath} from "url";
import { ClauseInclusionServiceHandlers } from "./controllers/clauseInclusion.controllers";

const __dirname = fileURLToPath(import.meta.url);

const __filename = path.dirname(__dirname);


const PROTO_PATH = path.join(__filename, "./proto/clauseInclusion.proto");

const packageDef = protoLoader.loadSync(PROTO_PATH);

const grpcObj = grpc.loadPackageDefinition(packageDef);

const clauseInclusionPackage = grpcObj.clauseInclusion as any;


const server = new grpc.Server();

server.addService(clauseInclusionPackage.ClauseInclusionService.service, ClauseInclusionServiceHandlers);

server.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), (err, port) => {

    if(err){

        console.log("The error we are getting from server",err);
        return;

    }

    console.log(`Clause Inclusion Server Is Listening On ${port}`);

})