/*==================================================
  UltimateEventDispatcher.js
  Full AS3 Event Dispatcher with Capture/Bubbling
  Supports stopPropagation, stopImmediatePropagation,
  defaultPrevented, and hierarchy event flow
==================================================*/

export class Event {
    constructor(type, bubbles=false, cancelable=false){
        this.type = type;
        this.bubbles = bubbles;
        this.cancelable = cancelable;
        this.target = null;
        this.currentTarget = null;
        this.eventPhase = 0; // 1 = CAPTURE, 2 = TARGET, 3 = BUBBLE
        this._stopped = false;
        this._immediateStopped = false;
        this._defaultPrevented = false;
    }

    stopPropagation(){
        this._stopped = true;
    }

    stopImmediatePropagation(){
        this._stopped = true;
        this._immediateStopped = true;
    }

    preventDefault(){
        if(this.cancelable) this._defaultPrevented = true;
    }

    get defaultPrevented(){
        return this._defaultPrevented;
    }
}

export class EventDispatcher {
    constructor(){
        this._listeners = {}; // {type: [{listener, useCapture}]}
        this.parent = null;   // hierarchy for bubbling
    }

    addEventListener(type, listener, useCapture=false){
        if(!this._listeners[type]) this._listeners[type] = [];
        this._listeners[type].push({listener, useCapture});
    }

    removeEventListener(type, listener, useCapture=false){
        if(!this._listeners[type]) return;
        this._listeners[type] = this._listeners[type].filter(
            l => l.listener !== listener || l.useCapture !== useCapture
        );
    }

    hasEventListener(type){
        return !!(this._listeners[type] && this._listeners[type].length);
    }

    dispatchEvent(event){
        event.target = this;

        // 1. Build propagation path (from root to parent)
        const path = [];
        let obj = this.parent;
        while(obj){
            path.unshift(obj); // root first
            obj = obj.parent;
        }

        // 2. Capture phase
        event.eventPhase = 1;
        for(let obj of path){
            event.currentTarget = obj;
            obj._invokeListeners(event, true);
            if(event._stopped) return !event.defaultPrevented;
        }

        // 3. Target phase
        event.eventPhase = 2;
        event.currentTarget = this;
        this._invokeListeners(event, false);
        if(event._stopped) return !event.defaultPrevented;

        // 4. Bubbling phase
        if(event.bubbles){
            event.eventPhase = 3;
            for(let obj of path.reverse()){
                event.currentTarget = obj;
                obj._invokeListeners(event, false);
                if(event._stopped) return !event.defaultPrevented;
            }
        }

        return !event.defaultPrevented;
    }

    _invokeListeners(event, useCapture){
        if(!this._listeners[event.type]) return;
        for(let l of [...this._listeners[event.type]]){ // clone to allow removal during dispatch
            if(l.useCapture === useCapture){
                try { l.listener.call(this, event); } 
                catch(e){ console.error("Event listener error:", e); }
                if(event._immediateStopped) break;
            }
        }
    }
}

/*==================================================
  END OF UltimateEventDispatcher.js
==================================================*/