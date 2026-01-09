/*==================================================
  Event.js
  Full AS3 Event System
==================================================*/

export class Event {
    constructor(type, bubbles=false, cancelable=false) {
        this.type = type;
        this.bubbles = bubbles;
        this.cancelable = cancelable;
        this.target = null;
        this.currentTarget = null;
        this.eventPhase = 0; // 0: none, 1: capture, 2: target, 3: bubbling
        this.defaultPrevented = false;
    }

    preventDefault() {
        if(this.cancelable) this.defaultPrevented = true;
    }

    stopPropagation() {
        this._stopped = true;
    }

    stopImmediatePropagation() {
        this._immediateStopped = true;
        this._stopped = true;
    }
}

// ===================== MouseEvent ===================
export class MouseEvent extends Event {
    constructor(type, bubbles=false, cancelable=false, localX=0, localY=0, ctrlKey=false, altKey=false, shiftKey=false, buttonDown=false) {
        super(type, bubbles, cancelable);
        this.localX = localX;
        this.localY = localY;
        this.ctrlKey = ctrlKey;
        this.altKey = altKey;
        this.shiftKey = shiftKey;
        this.buttonDown = buttonDown;
    }
}

// ===================== KeyboardEvent ===================
export class KeyboardEvent extends Event {
    constructor(type, bubbles=false, cancelable=false, keyCode=0, charCode=0, ctrlKey=false, altKey=false, shiftKey=false) {
        super(type, bubbles, cancelable);
        this.keyCode = keyCode;
        this.charCode = charCode;
        this.ctrlKey = ctrlKey;
        this.altKey = altKey;
        this.shiftKey = shiftKey;
    }
}

// ===================== TouchEvent ===================
export class TouchEvent extends Event {
    constructor(type, bubbles=false, cancelable=false, localX=0, localY=0, touchPointID=0) {
        super(type, bubbles, cancelable);
        this.localX = localX;
        this.localY = localY;
        this.touchPointID = touchPointID;
    }
}

// ===================== EventDispatcher ===================
export class EventDispatcher {
    constructor() {
        this._listeners = {};
    }

    addEventListener(type, listener) {
        if(!this._listeners[type]) this._listeners[type] = [];
        this._listeners[type].push(listener);
    }

    removeEventListener(type, listener) {
        if(!this._listeners[type]) return;
        this._listeners[type] = this._listeners[type].filter(l => l !== listener);
    }

    dispatchEvent(event) {
        event.target = this;
        const listeners = this._listeners[event.type];
        if(listeners) {
            for(let listener of listeners) {
                if(event._immediateStopped) break;
                listener(event);
            }
        }
    }

    hasEventListener(type) {
        return !!(this._listeners[type] && this._listeners[type].length);
    }
}

/*==================================================
  END OF Event.js
==================================================*/