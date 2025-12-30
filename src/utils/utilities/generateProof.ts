import * as snarkjs from "snarkjs";
import { GenerateProofType } from "../../types/types";


const generateProof = async (inputs: {agreementId: string, clauseSetHashId: string, commitment: string} , WASM_PATH:string, ZKEY_PATH: string): Promise<GenerateProofType | void> => {


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

        console.log("Proof Generation failed", error);

        // throw new Error("CIRCUIT_CONSTRAINT_FAILED");

        throw error;



    }

}





// export const generateProof = async (
//     inputs: {
//         bg_amount: any,
//         bg_expiry: any,
//         applicant_rating: any,
//         bank_internal_code: any,
//         commitment: any
//     },
//     WASM_PATH: string,
//     ZKEY_PATH: string
// ) => {
//     try {
//         console.log("Inputs:", inputs);

//         // Generate proof + public signals
//         const { proof, publicSignals } = await snarkjs.groth16.fullProve(
//             inputs,
//             WASM_PATH,
//             ZKEY_PATH
//         );

//         console.log("Public signals:", publicSignals);

//         // Convert proof + public signals into Solidity-compatible calldata
//         const callData = await snarkjs.groth16.exportSolidityCallData(proof, publicSignals);

//         // calldata comes as string: "a,b,[c,d],e,f..." → parse it
//         const argv = callData.replace(/["[\]\s]/g, "").split(",");

//         // Reconstruct proof object in a, b, c format for smart contract
//         const a = [argv[0], argv[1]];
//         const b = [
//             [argv[2], argv[3]],
//             [argv[4], argv[5]]
//         ];
//         const c = [argv[6], argv[7]];

//         // Remaining are public signals
//         const pubSignals = argv.slice(8).map(x => BigInt(x).toString());

//         console.log("Proof a:", a);
//         console.log("Proof b:", b);
//         console.log("Proof c:", c);
//         console.log("Public signals:", pubSignals);

//         return { a, b, c, pubSignals };

//     } catch (err) {
//         console.error("Error generating proof:", err);
//     }
// };



export default generateProof;


  // const a = [BigInt(argv[0]).toString(), BigInt(argv[1]).toString()];
        // const b = [
        //    [BigInt(argv[2]).toString(), BigInt(argv[3]).toString()],
        //     [BigInt(argv[4]).toString(), BigInt(argv[5]).toString()]
        // ];
        // const c = [BigInt(argv[6]).toString(), BigInt(argv[7]).toString()];

        // Remaining are public signals
        // const inputSignals = argv.slice(8).map(x => BigInt(x).toString());

        // console.log("Proof a:", a);
        // console.log("Proof b:", b);
        // console.log("Proof c:", c);
        // console.log("Public signals:", inputSignals);