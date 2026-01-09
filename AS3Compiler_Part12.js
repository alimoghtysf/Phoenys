/*==================================================
  AS3Compiler_Part12.js
  Event System + Keyboard + Mouse + Timer + Drag - Part 12
==================================================*/

import {EventDispatcher, Event} from './AS3Compiler_Part7.js';

export class KeyboardEvent extends Event {
    constructor(type, keyCode=0){
        super(type);
        this.keyCode = keyCode;
    }
}

export class MouseEvent extends Event {
    constructor(type, x=0, y=0, button=0){
        super(type);
        this.x = x;
        this.y = y;
        this.button = button;
    }
}

export class TimerEvent extends Event {
    constructor(type, currentCount=0){
        super(type);
        this.currentCount = currentCount;
    }
}

export class Timer extends EventDispatcher {
    constructor(delay=1000, repeatCount=0){
        super();
        this.delay = delay;
        this.repeatCount = repeatCount;
        this.currentCount = 0;
        this._interval = null;
    }

    start(){
        if(this._interval) this.stop();
        this._interval = setInterval(() => {
            this.currentCount++;
            this.dispatchEvent(new TimerEvent("timer", this.currentCount));
            if(this.repeatCount > 0 && this.currentCount >= this.repeatCount){
                this.stop();
                this.dispatchEvent(new TimerEvent("timerComplete", this.currentCount));
            }
        }, this.delay);
    }

    stop(){
        if(this._interval){
            clearInterval(this._interval);
            this._interval = null;
        }
    }

    reset(){
        this.stop();
        this.currentCount = 0;
    }
}

export class InteractiveObject extends EventDispatcher {
    constructor(){
        super();
        this.mouseEnabled = true;
        this.keyboardEnabled = true;
        this.dragging = false;
    }

    startDrag(){
        this.dragging = true;
    }

    stopDrag(){
        this.dragging = false;
    }
}

/*==================================================
  END OF AS3Compiler_Part12.js
==================================================*/