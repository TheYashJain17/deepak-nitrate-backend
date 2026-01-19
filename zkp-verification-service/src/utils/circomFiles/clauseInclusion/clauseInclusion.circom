pragma circom 2.1.4;

include "../circomlib/circuits/poseidon.circom";

template BGCommitmentVerifier() {

    // Inputs
    signal input agreementId;       
    signal input clauseSetHash;     
    // signal input policyId;          
    signal input commitment;        


    signal output out;              


    // component hasher = Poseidon(3);
    component hasher = Poseidon(2);
    hasher.inputs[0] <== agreementId;
    hasher.inputs[1] <== clauseSetHash;
    // hasher.inputs[2] <== policyId;

    out <== hasher.out;


    commitment === out;
}

component main = BGCommitmentVerifier()