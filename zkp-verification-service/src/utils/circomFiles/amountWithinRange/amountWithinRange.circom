pragma circom 2.1.4;

include "../circomlib/circuits/poseidon.circom";
include "../circomlib/circuits/comparators.circom";

template InvoiceTotalVerifier() {

    // -----------------------------------
    // Public Inputs
    // -----------------------------------
    signal input invoiceTotal;         // Invoice Total
    signal input poBalance;            // PO Balance
    signal input poBalance_hash;       // Poseidon(poBalance) provided externally

    // -----------------------------------
    // Public Output (Hash of invoice + PO)
    // -----------------------------------
    signal output out;                 // Poseidon(invoiceTotal, poBalance)

    // ========================================================
    // 1️⃣ HASH: Poseidon(invoiceTotal, poBalance)
    // ========================================================
    component mainHash = Poseidon(2);
    mainHash.inputs[0] <== invoiceTotal;
    mainHash.inputs[1] <== poBalance;

    out <== mainHash.out;

    // ========================================================
    // 2️⃣ HASH CHECK: Poseidon(poBalance) === poBalance_hash
    // ========================================================
    component poHash = Poseidon(1);
    poHash.inputs[0] <== poBalance;

    // enforce matching hash
    poHash.out === poBalance_hash;

    // ========================================================
    // 3️⃣ CONDITION: invoiceTotal ≤ poBalance
    // ========================================================

    // Use LessThan(x < y)
    // invoiceTotal ≤ poBalance is equivalent to: invoiceTotal < (poBalance + 1)

    signal poBalancePlusOne;
    poBalancePlusOne <== poBalance + 1;

    component ltEq = LessThan(64);
    ltEq.in[0] <== invoiceTotal;       // Left side
    ltEq.in[1] <== poBalancePlusOne;   // Right side

    // ltEq.out = 1 means invoiceTotal < poBalance + 1 → invoiceTotal ≤ poBalance
    ltEq.out === 1;
}

component main = InvoiceTotalVerifier();