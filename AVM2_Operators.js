/*==================================================
  AVM2_Operators.js
  AS3 Operators - Arithmetic, Logical, Comparison
==================================================*/

import { AVM2 } from "./AVM2_Core.js";

export class AVM2Operators {
    constructor(avm2) {
        this.avm2 = avm2;
    }

    // Arithmetic operations
    add(a, b) {
        return a + b;
    }

    subtract(a, b) {
        return a - b;
    }

    multiply(a, b) {
        return a * b;
    }

    divide(a, b) {
        return a / b;
    }

    modulus(a, b) {
        return a % b;
    }

    increment(a) {
        return a + 1;
    }

    decrement(a) {
        return a - 1;
    }

    // Logical operations
    and(a, b) {
        return a && b;
    }

    or(a, b) {
        return a || b;
    }

    not(a) {
        return !a;
    }

    // Comparison operations
    equals(a, b) {
        return a == b;
    }

    strictEquals(a, b) {
        return a === b;
    }

    notEquals(a, b) {
        return a != b;
    }

    strictNotEquals(a, b) {
        return a !== b;
    }

    greaterThan(a, b) {
        return a > b;
    }

    lessThan(a, b) {
        return a < b;
    }

    greaterOrEqual(a, b) {
        return a >= b;
    }

    lessOrEqual(a, b) {
        return a <= b;
    }

    // Type coercion like AS3
    toNumber(value) {
        return Number(value);
    }

    toString(value) {
        return String(value);
    }

    toBoolean(value) {
        return Boolean(value);
    }
}

/*==================================================
  END OF AVM2_Operators.js
==================================================*/