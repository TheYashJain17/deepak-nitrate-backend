import { config } from "dotenv";
import { ethers } from "ethers";

config({quiet: true});

const getContractInstance = async(contractAddress: string, abi: object | []): Promise<ethers.Contract> => {

    const providerUrl = process.env.PROVIDER_URL;
    // const contractAddress = process.env.CONTRACT_ADDRESS; 

    const provider = new ethers.JsonRpcProvider(providerUrl);

    const signer = new ethers.Wallet(process.env.PRIVATE_KEY as string , provider);

    return new ethers.Contract(contractAddress as string, abi as [], signer);

} 

export default getContractInstance;