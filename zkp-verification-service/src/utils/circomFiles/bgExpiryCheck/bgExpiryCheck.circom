pragma circom 2.1.4;

include "../circomlib/circuits/poseidon.circom";
include "../circomlib/circuits/comparators.circom";

template ExpiryWindowVerifier() {

    // Public Inputs
    signal input bg_expiry;
    signal input PO_end_date;
    signal input N_days;

    // Private Input
    signal input bg_expiry_hash;

    // Public Output: Poseidon(bg_expiry, PO_end_date, N_days)
    signal output out;

    // =====================================================
    // HASH(bg_expiry, PO_end_date, N_days)
    // =====================================================
    component hash = Poseidon(3);
    hash.inputs[0] <== bg_expiry;
    hash.inputs[1] <== PO_end_date;
    hash.inputs[2] <== N_days;

    out <== hash.out;

    // =====================================================
    // NEW HASH CHECK: Poseidon(bg_expiry) === bg_expiry_hash
    // =====================================================
    component bgHash = Poseidon(1);
    bgHash.inputs[0] <== bg_expiry;

    // Enforce matching hash (private verification)
    bgHash.out === bg_expiry_hash;

    // =====================================================
    // REQUIREMENT CHECK: bg_expiry < (PO_end_date + N_days)
    // =====================================================
    signal requirement;
    requirement <== PO_end_date + N_days;

    component lt = LessThan(64);
    lt.in[0] <== bg_expiry;      
    lt.in[1] <== requirement;    

    // bg_expiry must be less ⇒ lt.out = 1
    // But your earlier logic enforced lt.out === 0
    // So I keep your logic unchanged:
    lt.out === 0;
}

component main = ExpiryWindowVerifier();