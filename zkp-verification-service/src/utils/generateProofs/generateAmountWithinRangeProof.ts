import * as snarkjs from "snarkjs";
import { GenerateProofType } from "../../types/types.js";
import normalizeZkpError from "../utilities/normaliseZKPError.js";




const generateAmountWithinRangeProof = async (inputs: {invoiceTotal: string, poBalance: string, poBalance_hash: string} , WASM_PATH:string, ZKEY_PATH: string): Promise<GenerateProofType | void> => {


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

    } catch (error) {

        const normalisedError = normalizeZkpError(error);

        throw normalisedError;



    }

}

export default generateAmountWithinRangeProof;