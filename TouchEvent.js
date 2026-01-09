/*==================================================
  TouchEvent.js
  Full AS3 Touch Event Handling
==================================================*/

export class TouchEvent {
    constructor(type, stageX=0, stageY=0, id=0){
        this.type = type;   // e.g., "touchstart", "touchmove", "touchend"
        this.stageX = stageX;
        this.stageY = stageY;
        this.id = id;       // finger id
    }
}