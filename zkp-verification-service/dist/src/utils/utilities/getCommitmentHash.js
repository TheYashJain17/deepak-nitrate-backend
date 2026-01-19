var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { buildPoseidon } from "circomlibjs";
const getCommitmentHash = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const keys = Object.keys(data);
        const values = keys.map(v => data[v]);
        const posiedon = yield buildPoseidon();
        const commitment = posiedon(values);
        const commitmentHash = posiedon.F.toObject(commitment);
        const stringCommitment = commitmentHash.toString(16);
        const hex = stringCommitment.padStart(64, "0");
        const bytes32Value = "0x" + hex;
        return bytes32Value;
    }
    catch (error) {
        console.log(error);
    }
});
export default getCommitmentHash;
