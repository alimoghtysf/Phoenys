/*==================================================
  AS3Compiler_Part2.js
  Functions + Variables Compiler - Part 2
  Supports Local Scopes, Arguments, Return, Function Traits
==================================================*/

import {AVM2Bytecode} from './AVM2_Bytecode.js';
import {AS3CompilerPart1} from './AS3Compiler_Part1.js';

export class AS3CompilerPart2 {
    constructor(compilerPart1) {
        this.compilerPart1 = compilerPart1; // الربط مع الجزء الأول
        this.globalFunctions = {};
    }

    // ================= Function Definition =================
    defineFunction(name, fn, options={static:false, scope:'global', args:[]}) {
        if(options.scope === 'global'){
            if(this.globalFunctions[name]){
                console.warn(`Global function ${name} already defined`);
                return;
            }
            this.globalFunctions[name] = {
                fn: fn,
                args: options.args,
                static: options.static
            };
        } else {
            // ضمن Class
            const cls = this.compilerPart1.getClass(options.scope);
            if(!cls){
                console.warn(`Class ${options.scope} not found for function ${name}`);
                return;
            }
            cls.methods[name] = {
                fn: fn,
                static: options.static,
                visibility: 'public'
            };
        }
    }

    // ================= Local Scope Execution =================
    executeFunction(name, scope='global', args=[]) {
        const avm2 = new AVM2Bytecode();
        let funcObj = null;
        if(scope === 'global'){
            funcObj = this.globalFunctions[name];
        } else {
            const cls = this.compilerPart1.getClass(scope);
            if(cls) funcObj = cls.methods[name];
        }
        if(!funcObj){
            console.warn(`Function ${name} not found`);
            return;
        }

        // تجهيز الـ Bytecode للتنفيذ
        avm2.push({op:'callproperty', name:name, argCount:args.length});
        for(let i = 0; i < args.length; i++){
            avm2.push({op:'pushbyte', value:args[i]});
        }

        // تنفيذ الـ function
        funcObj.fn(...args);
        return avm2;
    }

    // ================= Variable Management =================
    setGlobalVar(name, value){
        const avm2 = new AVM2Bytecode();
        avm2.push({op:'setglobal', name:name, value:value});
        return avm2;
    }

    getGlobalVar(name){
        const avm2 = new AVM2Bytecode();
        avm2.push({op:'getglobal', name:name});
        return avm2;
    }
}

/*==================================================
  END OF AS3Compiler_Part2.js
==================================================*/