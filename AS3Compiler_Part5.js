/*==================================================
  AS3Compiler_Part5.js
  Classes + Interfaces + Inheritance + Traits - Part 5
==================================================*/

import {AVM2Bytecode} from './AVM2_Bytecode.js';
import {AS3CompilerPart4} from './AS3Compiler_Part4.js';

export class AS3CompilerPart5 {
    constructor(compilerPart4) {
        this.compilerPart4 = compilerPart4; // الربط مع الجزء الرابع
        this.classes = {};
        this.traits = {};
        this.interfaces = {};
    }

    // ================= Class Definition =================
    defineClass(name, superClass=null, constructorFn=null, traits={}) {
        class NewClass extends (superClass || Object) {
            constructor(...args){
                super(...args);
                if(constructorFn) constructorFn.apply(this, args);
            }
        }

        // Apply traits (methods/properties)
        for(const key in traits){
            Object.defineProperty(NewClass.prototype, key, {
                value: traits[key],
                writable: true,
                configurable: true,
                enumerable: false
            });
        }

        this.classes[name] = NewClass;
        return NewClass;
    }

    // ================= Interface Definition =================
    defineInterface(name, methodNames=[]) {
        this.interfaces[name] = methodNames;
        return methodNames;
    }

    // ================= Check Interface Implementation =================
    implementsInterface(instance, interfaceName){
        const methods = this.interfaces[interfaceName] || [];
        for(const m of methods){
            if(typeof instance[m] !== 'function'){
                throw new Error(`Class does not implement interface method: ${m}`);
            }
        }
        return true;
    }

    // ================= Traits =================
    addTrait(classRef, name, value){
        Object.defineProperty(classRef.prototype, name, {
            value: value,
            writable: true,
            configurable: true,
            enumerable: false
        });
    }

    // ================= Inheritance =================
    extendClass(subClass, superClass){
        Object.setPrototypeOf(subClass.prototype, superClass.prototype);
        Object.setPrototypeOf(subClass, superClass);
    }

    // ================= Get Class Reference =================
    getClass(name){
        return this.classes[name];
    }
}

/*==================================================
  END OF AS3Compiler_Part5.js
==================================================*/