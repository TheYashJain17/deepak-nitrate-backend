import grpc from "@grpc/grpc-js";

import protoLoader from "@grpc/proto-loader";
import path from "path";

import {fileURLToPath} from "url";
import { ZKPVerificationServiceHandlers } from "./controllers/zkpVerification.controllers.js";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);


// const PROTO_PATH = path.join(__dirname, "./proto/zkpVerification.proto"); //this is for local 
const PROTO_PATH = path.join(__dirname, "../proto/zkpVerification.proto"); //this is for prod , use this before doing the build thing means for docker

const packageDef = protoLoader.loadSync(PROTO_PATH);

const grpcObj = grpc.loadPackageDefinition(packageDef);

const zkpVerificationPackage = grpcObj.zkpVerification as any;


const server = new grpc.Server();

server.addService(zkpVerificationPackage.ZKPVerificationService.service, ZKPVerificationServiceHandlers);

server.bindAsync("0.0.0.0:50055", grpc.ServerCredentials.createInsecure(), (err, port) => {

    if(err){

        console.log("The error we are getting from server",err);
        return;

    }

    console.log(`ZKP Verification Server Is Listening On ${port}`);

})