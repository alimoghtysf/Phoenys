/*==================================================
  AS3Compiler_Part4.js
  Operators + Expressions + Type Coercion + Casting - Part 4
==================================================*/

import {AVM2Bytecode} from './AVM2_Bytecode.js';
import {AS3CompilerPart3} from './AS3Compiler_Part3.js';

export class AS3CompilerPart4 {
    constructor(compilerPart3) {
        this.compilerPart3 = compilerPart3; // الربط مع الجزء الثالث
    }

    // ================= Arithmetic Operators =================
    add(a, b){ return a + b; }
    subtract(a, b){ return a - b; }
    multiply(a, b){ return a * b; }
    divide(a, b){ return a / b; }
    modulo(a, b){ return a % b; }

    increment(a){ return a + 1; }
    decrement(a){ return a - 1; }

    addAssign(a, b){ return a + b; }
    subAssign(a, b){ return a - b; }
    mulAssign(a, b){ return a * b; }
    divAssign(a, b){ return a / b; }
    modAssign(a, b){ return a % b; }

    // ================= Logical Operators =================
    logicalAnd(a, b){ return a && b; }
    logicalOr(a, b){ return a || b; }
    logicalNot(a){ return !a; }

    // ================= Comparison Operators =================
    equals(a, b){ return a == b; }
    strictEquals(a, b){ return a === b; }
    notEquals(a, b){ return a != b; }
    strictNotEquals(a, b){ return a !== b; }
    lessThan(a, b){ return a < b; }
    greaterThan(a, b){ return a > b; }
    lessEqual(a, b){ return a <= b; }
    greaterEqual(a, b){ return a >= b; }

    // ================= Type Coercion =================
    coerceToNumber(val){ return Number(val); }
    coerceToInt(val){ return parseInt(val); }
    coerceToUint(val){ return val >>> 0; }
    coerceToBoolean(val){ return Boolean(val); }
    coerceToString(val){ return String(val); }
    coerceToArray(val){ return Array.isArray(val) ? val : [val]; }
    coerceToObject(val){ return (typeof val === 'object') ? val : {value: val}; }

    // ================= Casting Functions =================
    castInt(val){ return parseInt(val); }
    castUint(val){ return val >>> 0; }
    castNumber(val){ return Number(val); }
    castBoolean(val){ return Boolean(val); }
    castString(val){ return String(val); }

    // ================= Expression Evaluator =================
    evaluateExpression(exprFn){
        try{
            return exprFn();
        } catch(e){
            console.warn("Expression evaluation error:", e);
            return undefined;
        }
    }
}

/*==================================================
  END OF AS3Compiler_Part4.js
==================================================*/