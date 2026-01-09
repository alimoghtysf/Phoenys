/*==================================================
  AS3Compiler_Part7.js
  Events + EventDispatcher + Listeners + Bubbling + Custom Events - Part 7
==================================================*/

export class Event {
    constructor(type, bubbles=false, cancelable=false, data=null){
        this.type = type;
        this.bubbles = bubbles;
        this.cancelable = cancelable;
        this.data = data;
        this.target = null;
        this.currentTarget = null;
        this.eventPhase = 0; // 1=capture, 2=target, 3=bubbling
        this.defaultPrevented = false;
    }

    preventDefault() {
        if(this.cancelable) this.defaultPrevented = true;
    }

    stopPropagation() {
        this.stopped = true;
    }
}

export class EventDispatcher {
    constructor(){
        this.listeners = {};
        this.parent = null; // For bubbling
    }

    addEventListener(type, callback){
        if(!this.listeners[type]) this.listeners[type] = [];
        if(!this.listeners[type].includes(callback)) this.listeners[type].push(callback);
    }

    removeEventListener(type, callback){
        if(!this.listeners[type]) return;
        const idx = this.listeners[type].indexOf(callback);
        if(idx >= 0) this.listeners[type].splice(idx, 1);
    }

    dispatchEvent(event){
        event.target = event.target || this;
        event.currentTarget = this;

        // Capture phase skipped for simplicity
        // Target phase
        if(this.listeners[event.type]){
            for(const cb of [...this.listeners[event.type]]){
                cb.call(this, event);
            }
        }

        // Bubbling phase
        if(event.bubbles && this.parent && !event.stopped){
            this.parent.dispatchEvent(event);
        }

        return !event.defaultPrevented;
    }

    hasEventListener(type){
        return this.listeners[type] && this.listeners[type].length > 0;
    }
}

// ================= Custom Event Example =================
export class CustomEvent extends Event {
    constructor(type, data=null, bubbles=false, cancelable=false){
        super(type, bubbles, cancelable, data);
    }
}

/*==================================================
  END OF AS3Compiler_Part7.js
==================================================*/