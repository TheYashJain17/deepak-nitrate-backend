var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { config } from "dotenv";
import { ethers } from "ethers";
config({ quiet: true });
const getContractInstance = (contractAddress, abi) => __awaiter(void 0, void 0, void 0, function* () {
    const providerUrl = process.env.PROVIDER_URL;
    // const contractAddress = process.env.CONTRACT_ADDRESS; 
    const provider = new ethers.JsonRpcProvider(providerUrl);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    return new ethers.Contract(contractAddress, abi, signer);
});
export default getContractInstance;
