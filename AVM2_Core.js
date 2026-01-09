/*==================================================
  AVM2_Core.js
  Core Engine for AS3 - Handles Execution Context, Stack, Scope
==================================================*/

export class AVM2 {
    constructor() {
        // Stack for execution
        this.stack = [];
        // Scope chain for variables
        this.scopeChain = [{}];
        // Loaded ABC scripts
        this.bytecodeFiles = [];
        // Global objects registry
        this.globals = {};
        // Classes registry
        this.classes = {};
        // Methods registry
        this.methods = {};
    }

    // Load ABC bytecode from SWFParser
    loadABC(abcArray) {
        for (let abc of abcArray) {
            this.bytecodeFiles.push(abc);
            // Preload classes
            if(abc.classes) {
                for (let clsName in abc.classes) {
                    this.classes[clsName] = abc.classes[clsName];
                }
            }
            // Preload methods
            if(abc.methods) {
                for (let methodName in abc.methods) {
                    this.methods[methodName] = abc.methods[methodName];
                }
            }
        }
    }

    // Push value to stack
    push(value) {
        this.stack.push(value);
    }

    // Pop value from stack
    pop() {
        return this.stack.pop();
    }

    // Get variable from scope chain
    getVariable(name) {
        for(let i = this.scopeChain.length - 1; i >= 0; i--) {
            if(name in this.scopeChain[i]) return this.scopeChain[i][name];
        }
        return undefined;
    }

    // Set variable in the top scope
    setVariable(name, value) {
        this.scopeChain[this.scopeChain.length - 1][name] = value;
    }

    // Enter new scope (function / block)
    enterScope(newScope={}) {
        this.scopeChain.push(newScope);
    }

    // Exit current scope
    exitScope() {
        this.scopeChain.pop();
    }

    // Get class reference by name
    getClass(name) {
        return this.classes[name];
    }

    // Get method reference by name
    getMethod(name) {
        return this.methods[name];
    }

    // Main entry to execute a root MovieClip
    run(rootClip) {
        // Enter global scope
        this.enterScope({_root: rootClip});
        // Execute all ABC scripts
        for (let abc of this.bytecodeFiles) {
            if(abc.frameScripts) {
                for(let script of abc.frameScripts) {
                    this.executeBytecode(script);
                }
            }
        }
        this.exitScope();
    }

    // Execute a single bytecode script (simplified)
    executeBytecode(script) {
        for(let i=0;i<script.instructions.length;i++) {
            const instr = script.instructions[i];
            // Example: simplified instruction execution
            switch(instr.op) {
                case "push":
                    this.push(instr.value);
                    break;
                case "pop":
                    this.pop();
                    break;
                case "setVar":
                    this.setVariable(instr.name, this.pop());
                    break;
                case "getVar":
                    this.push(this.getVariable(instr.name));
                    break;
                default:
                    console.warn("Unknown instruction:", instr.op);
            }
        }
    }
}

/*==================================================
  END OF AVM2_Core.js
==================================================*/