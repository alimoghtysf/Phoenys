/*==================================================
  AVM2_Functions.js
  AS3 Functions & Methods - Full Support
==================================================*/

import { AVM2 } from "./AVM2_Core.js";
import { AVM2Classes } from "./AVM2_Classes.js";

export class AVM2Functions {
    constructor(avm2, classes) {
        this.avm2 = avm2;
        this.classes = classes;
        this.callStack = [];
    }

    // Call a method by name with args and context
    callMethod(methodName, context = null, args = []) {
        const method = this.avm2.getMethod(methodName);
        if(!method) {
            console.error(`Method ${methodName} not found`);
            return;
        }
        this.enterCallStack(methodName, context, args);
        const result = method.apply(context, args);
        this.exitCallStack();
        return result;
    }

    // Enter a new call stack frame
    enterCallStack(methodName, context, args) {
        this.callStack.push({ methodName, context, args, locals: {} });
        // Enter a new scope in AVM2
        this.avm2.enterScope({});
    }

    // Exit current call stack frame
    exitCallStack() {
        this.callStack.pop();
        this.avm2.exitScope();
    }

    // Define a new function dynamically
    defineFunction(name, fn) {
        this.avm2.methods[name] = fn;
    }

    // Get current call stack frame
    currentFrame() {
        return this.callStack[this.callStack.length - 1];
    }

    // Set local variable in current function
    setLocalVar(name, value) {
        const frame = this.currentFrame();
        if(frame) frame.locals[name] = value;
        this.avm2.setVariable(name, value);
    }

    // Get local variable in current function
    getLocalVar(name) {
        const frame = this.currentFrame();
        if(frame && name in frame.locals) return frame.locals[name];
        return this.avm2.getVariable(name);
    }

    // Support closures
    createClosure(fn, capturedScope = {}) {
        return (...args) => {
            this.avm2.enterScope(capturedScope);
            const result = fn(...args);
            this.avm2.exitScope();
            return result;
        };
    }
}

/*==================================================
  END OF AVM2_Functions.js
==================================================*/