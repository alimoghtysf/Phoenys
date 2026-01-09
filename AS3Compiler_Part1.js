/*==================================================
  AS3Compiler_Part1.js
  Classes + Traits Compiler - Part 1
  Supports Dynamic, Sealed, Abstract, Interfaces
==================================================*/

import {AVM2Bytecode} from './AVM2_Bytecode.js';

export class AS3CompilerPart1 {
    constructor() {
        this.classTable = {};  // كل الكلاسات
        this.currentClass = null;
        this.bytecode = [];
    }

    // ================= Class Definition =================
    defineClass(name, options={dynamic:true, sealed:false, abstract:false, interface:false}) {
        if(this.classTable[name]) {
            console.warn(`Class ${name} already defined`);
            return;
        }
        const cls = {
            name: name,
            dynamic: options.dynamic,
            sealed: options.sealed,
            abstract: options.abstract,
            interface: options.interface,
            superClass: options.superClass || null,
            traits: {},
            methods: {}
        };
        this.classTable[name] = cls;
        this.currentClass = cls;
    }

    setSuperClass(superName) {
        if(!this.currentClass) return;
        this.currentClass.superClass = superName;
    }

    // ================= Traits =================
    addProperty(name, options={type:null, getter:false, setter:false, static:false, defaultValue:null}) {
        if(!this.currentClass) return;
        this.currentClass.traits[name] = {
            type: options.type,
            getter: options.getter,
            setter: options.setter,
            static: options.static,
            value: options.defaultValue
        };
    }

    addMethod(name, fn=null, options={static:false, override:false, visibility:'public'}) {
        if(!this.currentClass) return;
        this.currentClass.methods[name] = {
            fn: fn,
            static: options.static,
            override: options.override,
            visibility: options.visibility
        };
    }

    // ================= Utility =================
    getClass(name){
        return this.classTable[name] || null;
    }

    // ================= Bytecode Generation =================
    generateBytecode() {
        const avm2 = new AVM2Bytecode();
        for(const className in this.classTable){
            const cls = this.classTable[className];

            // انشاء Class object
            avm2.push({op:'construct', className:cls.name});

            // Traits
            for(const traitName in cls.traits){
                const trait = cls.traits[traitName];
                if(trait.getter || trait.setter){
                    // ignore for now, يتم اضافتها لاحقًا
                    continue;
                } else {
                    avm2.push({op:'setproperty', name:traitName, value:trait.value});
                }
            }

            // Methods
            for(const methodName in cls.methods){
                const method = cls.methods[methodName];
                // تسجيل كـ property callable
                avm2.push({op:'setproperty', name:methodName, value:method.fn});
            }
        }
        this.bytecode = avm2.stack;
        return this.bytecode;
    }

    executeClass(name){
        const avm2 = new AVM2Bytecode();
        const cls = this.getClass(name);
        if(!cls) return null;
        // تنفيذ الكود المبسط
        avm2.push({op:'construct', className:cls.name});
        return avm2;
    }
}

/*==================================================
  END OF AS3Compiler_Part1.js
==================================================*/