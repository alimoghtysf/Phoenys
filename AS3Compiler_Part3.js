/*==================================================
  AS3Compiler_Part3.js
  Control Flow + Loops + Exceptions - Part 3
==================================================*/

import {AVM2Bytecode} from './AVM2_Bytecode.js';
import {AS3CompilerPart2} from './AS3Compiler_Part2.js';

export class AS3CompilerPart3 {
    constructor(compilerPart2) {
        this.compilerPart2 = compilerPart2; // الربط مع الجزء الثاني
    }

    // ================= Conditional Statements =================
    compileIf(conditionFn, thenFn, elseFn=null) {
        const avm2 = new AVM2Bytecode();
        const condition = conditionFn();
        if(condition) {
            thenFn();
        } else if(elseFn) {
            elseFn();
        }
        return avm2;
    }

    compileSwitch(value, cases) {
        const avm2 = new AVM2Bytecode();
        let matched = false;
        for(const c of cases){
            if(c.value === value){
                matched = true;
                c.action();
                break;
            }
        }
        if(!matched && cases.default) cases.default();
        return avm2;
    }

    // ================= Loops =================
    compileFor(initFn, conditionFn, incrementFn, bodyFn) {
        const avm2 = new AVM2Bytecode();
        for(initFn(); conditionFn(); incrementFn()){
            bodyFn();
        }
        return avm2;
    }

    compileWhile(conditionFn, bodyFn) {
        const avm2 = new AVM2Bytecode();
        while(conditionFn()){
            bodyFn();
        }
        return avm2;
    }

    compileDoWhile(bodyFn, conditionFn) {
        const avm2 = new AVM2Bytecode();
        do {
            bodyFn();
        } while(conditionFn());
        return avm2;
    }

    compileForIn(obj, bodyFn) {
        const avm2 = new AVM2Bytecode();
        for(const key in obj){
            bodyFn(key, obj[key]);
        }
        return avm2;
    }

    compileForEach(obj, bodyFn) {
        const avm2 = new AVM2Bytecode();
        for(const val of obj){
            bodyFn(val);
        }
        return avm2;
    }

    // ================= Exceptions =================
    compileTryCatchFinally(tryFn, catchFn=null, finallyFn=null) {
        const avm2 = new AVM2Bytecode();
        try {
            tryFn();
        } catch(e){
            if(catchFn) catchFn(e);
        } finally {
            if(finallyFn) finallyFn();
        }
        return avm2;
    }

    compileThrow(error) {
        const avm2 = new AVM2Bytecode();
        throw error;
        return avm2;
    }
}

/*==================================================
  END OF AS3Compiler_Part3.js
==================================================*/