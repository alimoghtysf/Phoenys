/*==================================================
  AVM2_Classes.js
  AS3 Classes & Object System - Full Support
==================================================*/

import { AVM2 } from "./AVM2_Core.js";

export class AVM2Classes {
    constructor(avm2) {
        this.avm2 = avm2;
        this.instances = new WeakMap(); // Map objects to class types
    }

    // Create new instance of a class
    createInstance(className, args = []) {
        const cls = this.avm2.getClass(className);
        if(!cls) {
            console.error(`Class ${className} not found`);
            return null;
        }
        const instance = Object.create(cls.prototype);
        if(cls.constructorFn) {
            cls.constructorFn.apply(instance, args);
        }
        this.instances.set(instance, cls);
        return instance;
    }

    // Get class type of an instance
    getClassOf(obj) {
        return this.instances.get(obj) || null;
    }

    // Add new class dynamically
    addClass(className, constructorFn, prototypeObj={}) {
        const cls = {
            constructorFn: constructorFn,
            prototype: prototypeObj
        };
        this.avm2.classes[className] = cls;
    }

    // Support inheritance
    extendClass(subClassName, superClassName) {
        const superCls = this.avm2.getClass(superClassName);
        const subCls = this.avm2.getClass(subClassName);
        if(!superCls || !subCls) {
            console.error("Invalid classes for inheritance");
            return;
        }
        subCls.prototype = Object.create(superCls.prototype);
        subCls.prototype.constructor = subCls.constructorFn;
    }

    // Check if object is instance of class
    isInstanceOf(obj, className) {
        const cls = this.avm2.getClass(className);
        if(!cls) return false;
        let proto = Object.getPrototypeOf(obj);
        while(proto) {
            if(proto === cls.prototype) return true;
            proto = Object.getPrototypeOf(proto);
        }
        return false;
    }

    // Bind static properties
    addStaticProperty(className, propName, value) {
        const cls = this.avm2.getClass(className);
        if(!cls) return;
        cls[propName] = value;
    }

    // Bind instance property
    addInstanceProperty(className, propName, value) {
        const cls = this.avm2.getClass(className);
        if(!cls) return;
        cls.prototype[propName] = value;
    }
}

/*==================================================
  END OF AVM2_Classes.js
==================================================*/