/*==================================================
  MouseEvent.js
  Full AS3 Mouse Event Handling
==================================================*/

export class MouseEvent {
    constructor(type, stageX=0, stageY=0, buttonDown=false){
        this.type = type;       // e.g., "click", "mousedown", "mouseup", "mousemove"
        this.stageX = stageX;
        this.stageY = stageY;
        this.buttonDown = buttonDown;
        this.altKey = false;
        this.ctrlKey = false;
        this.shiftKey = false;
    }
}