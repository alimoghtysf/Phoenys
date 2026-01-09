/*==================================================
  AVM2_Classes_Traits.js
  Full Traits, Properties, Methods & Namespaces for AS3
==================================================*/

import {ASObject} from './AVM2_Classes_Core.js';

export class Trait {
    constructor(name, value=null, kind="property", namespace="public") {
        this.name = name;
        this.value = value;
        this.kind = kind; // "property" | "method" | "getter" | "setter"
        this.namespace = namespace;
    }
}

export class ASClass extends ASObject {
    constructor(name) {
        super();
        this.className = name;
        this.traits = {};      // Traits for instance
        this.staticTraits = {}; // Static Traits
    }

    addTrait(trait) {
        const target = trait.kind === "static" ? this.staticTraits : this.traits;
        target[`${trait.namespace}::${trait.name}`] = trait;
    }

    getTrait(name, namespace="public") {
        return this.traits[`${namespace}::${name}`] || null;
    }

    getStaticTrait(name, namespace="public") {
        return this.staticTraits[`${namespace}::${name}`] || null;
    }

    callMethod(name, args=[], namespace="public") {
        const trait = this.getTrait(name, namespace);
        if(trait && trait.kind === "method" && typeof trait.value === "function") {
            return trait.value.apply(this, args);
        }
        console.warn(`Method ${namespace}::${name} not found`);
        return undefined;
    }

    setProperty(name, value, namespace="public") {
        const trait = this.getTrait(name, namespace);
        if(trait && trait.kind === "property") {
            trait.value = value;
        } else {
            this.traits[`${namespace}::${name}`] = new Trait(name, value, "property", namespace);
        }
    }

    getProperty(name, namespace="public") {
        const trait = this.getTrait(name, namespace);
        if(trait && trait.kind === "property") {
            return trait.value;
        }
        return undefined;
    }
}

// ================= Utility Functions =================

export function defineProperty(obj, name, getter=null, setter=null, namespace="public") {
    if(getter) obj.addTrait(new Trait(name, getter, "getter", namespace));
    if(setter) obj.addTrait(new Trait(name, setter, "setter", namespace));
}

export function defineMethod(obj, name, func, namespace="public") {
    obj.addTrait(new Trait(name, func, "method", namespace));
}

/*==================================================
  END OF AVM2_Classes_Traits.js
==================================================*/