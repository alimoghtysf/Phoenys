/*==================================================
  KeyboardEvent.js
  Full AS3 Keyboard Event Handling
==================================================*/

export class KeyboardEvent {
    constructor(type, keyCode=0, charCode=0){
        this.type = type;   // e.g., "keydown", "keyup"
        this.keyCode = keyCode;
        this.charCode = charCode;
        this.altKey = false;
        this.ctrlKey = false;
        this.shiftKey = false;
    }
}