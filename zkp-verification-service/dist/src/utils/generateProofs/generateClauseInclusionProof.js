var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as snarkjs from "snarkjs";
import normalizeZkpError from "../utilities/normaliseZKPError.js";
const generateClauseInclusionProof = (inputs, WASM_PATH, ZKEY_PATH) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { proof, publicSignals } = yield snarkjs.groth16.fullProve(inputs, WASM_PATH, ZKEY_PATH);
        const callData = yield snarkjs.groth16.exportSolidityCallData(proof, publicSignals);
        const argv = callData.replace(/["[\]\s]/g, "").split(",");
        const a = [argv[0], argv[1]];
        const b = [
            [argv[2], argv[3]],
            [argv[4], argv[5]]
        ];
        const c = [argv[6], argv[7]];
        const inputSignals = argv.slice(8);
        return { a, b, c, inputSignals };
    }
    catch (error) {
        // console.log("The error we are geting in clause inclusion proof is", error);
        const normalised = normalizeZkpError(error);
        // console.log("Proof Generation failed", normalised);
        // throw new Error("CIRCUIT_CONSTRAINT_FAILED");
        throw normalised;
    }
});
export default generateClauseInclusionProof;
