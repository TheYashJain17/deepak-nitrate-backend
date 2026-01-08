import { buildPoseidon } from "circomlibjs";

const getCommitmentHash = async (data: any): Promise<string | void> => {

    try {

        const keys = Object.keys(data);

        const values = keys.map(v => data[v]);

        const posiedon = await buildPoseidon();


        const commitment = posiedon(values);

        const commitmentHash = posiedon.F.toObject(commitment);

        const stringCommitment = commitmentHash.toString(16);

        const hex = stringCommitment.padStart(64, "0");

        const bytes32Value = "0x" + hex;

        return bytes32Value;


    } catch (error) {

        console.log(error);

    }

}

export default getCommitmentHash;