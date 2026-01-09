/*==================================================
  AS3Compiler_Part6.js
  Namespaces + Packages + Imports + Static Members - Part 6
==================================================*/

import {AS3CompilerPart5} from './AS3Compiler_Part5.js';

export class AS3CompilerPart6 {
    constructor(compilerPart5) {
        this.compilerPart5 = compilerPart5; // الربط مع الجزء الخامس
        this.namespaces = {};
        this.packages = {};
    }

    // ================= Namespaces =================
    defineNamespace(nsName) {
        if(!this.namespaces[nsName]) this.namespaces[nsName] = {};
        return this.namespaces[nsName];
    }

    useNamespace(nsName) {
        return this.namespaces[nsName] || {};
    }

    // ================= Packages =================
    definePackage(packageName) {
        if(!this.packages[packageName]) this.packages[packageName] = {};
        return this.packages[packageName];
    }

    addToPackage(packageName, className, classRef) {
        const pkg = this.packages[packageName] || this.definePackage(packageName);
        pkg[className] = classRef;
    }

    getFromPackage(packageName, className){
        const pkg = this.packages[packageName];
        if(pkg) return pkg[className];
        return null;
    }

    // ================= Imports =================
    importClass(packageName, className) {
        const cls = this.getFromPackage(packageName, className);
        if(!cls) throw new Error(`Class ${className} not found in package ${packageName}`);
        return cls;
    }

    // ================= Static Members =================
    defineStatic(classRef, name, value){
        Object.defineProperty(classRef, name, {
            value: value,
            writable: true,
            configurable: true,
            enumerable: false
        });
    }

    getStatic(classRef, name){
        return classRef[name];
    }
}

/*==================================================
  END OF AS3Compiler_Part6.js
==================================================*/