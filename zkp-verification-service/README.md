ZKP Full Flow

1.First of all run this command:-
    git clone https://github.com/iden3/circom.git

2.Then move inside the cargo folder inside which the code got clonned.

3.Then first run cargo run command which latest version of cargo.

4.Then run cargo build --release command which will create a file inside target/release/circom

5.The above file we got contains the circom binary which will help us to to build the circom circuit

6.Now create a directory where we will keep our circuit file And inside it define the circuit file we want to make, like for example test.circom.

7.Now inside the generated file test.circom design your circuit , put the logic for your circuit.

8.After creating the above file, create another folder with name build and then run this command :- 
    ../circom/target/release/circom test.circom --r1cs --wasm --sym -o build 
which is taking the generated circom binary then the circuit file we generated and in result we are getting these files build/test.r1cs ,build/test.sym ,
build/test_js/test.wasm

9.Now Manually Create a file named input.json and enter the values in the input.json as per the logic defined inside your circuit and 
then run this command :- 
    node build/test_js/generate_witness.js build/test_js/test.wasm input.json witness.wtns
the above command will generate witness.wtns file. (adjust the paths of files providing in the command as per yourself).

10.Now we have to create witness.json file and for that first install snark.js that too globally for better file handling.

11.After installing snarkjs , run this command :-
    snarkjs wej witness.wtns witness.json
the above command will generate a witness.json file.

12.Now we have to compute the witnes we have generated so that it can be used in proof generation , so for this run this command :- 
    snarkjs calculatewitness --wasm  build/test_js/test.wasm --input input.json --witness witness.json
after running the above command the witness.json will be changed and it will not be same as before normal json file.

13.After that we have to create the zkey and for that we need a file with extension .ptau , like powersOfTau15_final.ptau , download this and then 
run these commands :- 
    snarkjs groth16 setup build/test.r1cs powersOfTau15_final.ptau test_0000.zkey
    snarkjs zkey contribute test_0000.zkey test_final.zkey --name="First contribution"
after running above commands a prompt will show up asking for random text , you can enter any text like here i have entered blocksynergytechnicallimited 
and after that we will get 2 new files , test_0000.zkey and test_final.zkey these files will help us in further process.

14.After that  we have to export the verification key which is needed at the time of proof verification so run this command :- 
    snarkjs zkey export verificationkey test_final.zkey verification_key.json
after running above command we will get a file name verification.json.

15.After that we have to generate the proof and for that , run this command :-
    snarkjs groth16 prove test_final.zkey witness.wtns proof.json public.json
after running the above command we will get 2 new files proof.json and public.json

16.To verify the generated proof , run this command :-
    snarkjs groth16 verify verification_key.json public.json proof.json
after running above command if the proof is correct then we will get :- [INFO]  snarkJS: OK!.

17.Now the final step is to get the Verifier contract from all the setup we have done , so for that run this command :- 
    snarkjs zkey export solidityverifier test_final.zkey verifier.sol
if everything is correct then a new file will be created verifier.sol which will contain whole logic of the contract which has to be deployed on chain

18. Now when we are going with the dynamic approach , we don’t have to follow some steps like generating json files as we are going to keep proof and signals in memory not in the file so don’t have to generate the input.json file neither witness.json , we mainly need user input , was file and zkey file when we are going with the dynamic approach.

19. If we want to make any changes in the circom circuit we have created , so after doing the changes run the step number 8 to again generate the WASM file and after that run the step number 13 to create the updated the zkey file just change the name everytime like second contribution or third contribution like this so that we can get the updated zkey file and with this file , at last run step number 17 as we have to again export the smart contract with the zkey to get the updated contract then deploy it again and then it will work.   


20. The inputs we are providing (the params like bg_expiry or po_date) inside the generateProof function  should be exactly same as we have written in the circom circuit 