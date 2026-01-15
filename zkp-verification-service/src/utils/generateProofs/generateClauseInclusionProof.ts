import * as snarkjs from "snarkjs";
import { GenerateProofType, ZKPErrorType } from "../../types/types.js";
import normalizeZkpError from "../utilities/normaliseZKPError.js";

const generateClauseInclusionProof = async (inputs: { agreementId: string, clauseSetHash: string, commitment: string }, WASM_PATH: string, ZKEY_PATH: string): Promise<GenerateProofType | void> => {


    try {

        const { proof, publicSignals } = await snarkjs.groth16.fullProve(inputs, WASM_PATH, ZKEY_PATH);


        const callData = await snarkjs.groth16.exportSolidityCallData(proof, publicSignals);

        const argv = callData.replace(/["[\]\s]/g, "").split(",");

        const a = [argv[0], argv[1]];
        const b = [
            [argv[2], argv[3]],
            [argv[4], argv[5]]
        ];
        const c = [argv[6], argv[7]];
        const inputSignals = argv.slice(8);


        return { a, b, c, inputSignals };

    } catch (error: unknown) {

        // console.log("The error we are geting in clause inclusion proof is", error);

        const normalised = normalizeZkpError(error);

        // console.log("Proof Generation failed", normalised);

        // throw new Error("CIRCUIT_CONSTRAINT_FAILED");

        throw normalised;



    }

}

export default generateClauseInclusionProof;
