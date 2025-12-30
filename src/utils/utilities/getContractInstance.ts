import {ethers} from "ethers";
import {config} from "dotenv";
import { clauseInclusionAbi } from "../ABIs/clauseInclusion.abi";

config({quiet: true});

const getContractInstance = async(): Promise<ethers.Contract> => {

    const providerUrl = process.env.PROVIDER_URL;
    const contractAddress = process.env.CONTRACT_ADDRESS; 

    const provider = new ethers.JsonRpcProvider(providerUrl);

    const signer = new ethers.Wallet(process.env.PRIVATE_KEY as string , provider);

    return new ethers.Contract(contractAddress as string, clauseInclusionAbi, signer);

} 

export default getContractInstance;