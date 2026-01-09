/*==================================================
  AVM2_Interpreter.js
  Full AS3 Bytecode Interpreter - Executes ABC Instructions
==================================================*/

import { AVM2 } from "./AVM2_Core.js";
import { AVM2Functions } from "./AVM2_Functions.js";
import { AVM2Classes } from "./AVM2_Classes.js";
import { AVM2Operators } from "./AVM2_Operators.js";
import { AVM2Events, EventDispatcher } from "./AVM2_Events.js";

export class AVM2Interpreter {
    constructor(avm2, classes, functions, operators) {
        this.avm2 = avm2;
        this.classes = classes;
        this.functions = functions;
        this.operators = operators;
    }

    // Execute ABC bytecode script
    execute(script) {
        for(let i=0;i<script.instructions.length;i++) {
            const instr = script.instructions[i];
            switch(instr.op) {
                case "push":
                    this.avm2.push(instr.value);
                    break;
                case "pop":
                    this.avm2.pop();
                    break;
                case "setVar":
                    this.avm2.setVariable(instr.name, this.avm2.pop());
                    break;
                case "getVar":
                    this.avm2.push(this.avm2.getVariable(instr.name));
                    break;
                case "callMethod":
                    const args = [];
                    for(let j=0;j<instr.argCount;j++) args.unshift(this.avm2.pop());
                    const context = this.avm2.pop();
                    const result = this.functions.callMethod(instr.name, context, args);
                    this.avm2.push(result);
                    break;
                case "newInstance":
                    const clsName = instr.className;
                    const newArgs = [];
                    for(let j=0;j<instr.argCount;j++) newArgs.unshift(this.avm2.pop());
                    const instance = this.classes.createInstance(clsName, newArgs);
                    this.avm2.push(instance);
                    break;
                case "operator":
                    const b = this.avm2.pop();
                    const a = this.avm2.pop();
                    const res = this.executeOperator(instr.operator, a, b);
                    this.avm2.push(res);
                    break;
                case "dispatchEvent":
                    const target = this.avm2.pop();
                    const event = this.avm2.pop();
                    if(target && typeof target.dispatchEvent === "function") {
                        target.dispatchEvent(event);
                    }
                    break;
                default:
                    console.warn("Unknown instruction:", instr.op);
            }
        }
    }

    // Execute operator instruction
    executeOperator(op, a, b) {
        switch(op) {
            case "+": return this.operators.add(a,b);
            case "-": return this.operators.subtract(a,b);
            case "*": return this.operators.multiply(a,b);
            case "/": return this.operators.divide(a,b);
            case "%": return this.operators.modulus(a,b);
            case "==": return this.operators.equals(a,b);
            case "===": return this.operators.strictEquals(a,b);
            case "!=": return this.operators.notEquals(a,b);
            case "!==": return this.operators.strictNotEquals(a,b);
            case ">": return this.operators.greaterThan(a,b);
            case "<": return this.operators.lessThan(a,b);
            case ">=": return this.operators.greaterOrEqual(a,b);
            case "<=": return this.operators.lessOrEqual(a,b);
            case "&&": return this.operators.and(a,b);
            case "||": return this.operators.or(a,b);
            default:
                console.warn("Unknown operator:", op);
                return null;
        }
    }
}

/*==================================================
  END OF AVM2_Interpreter.js
==================================================*/