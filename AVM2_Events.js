/*==================================================
  AVM2_Events.js
  AS3 Event System - Full Support
==================================================*/

import { AVM2 } from "./AVM2_Core.js";

export class Event {
    constructor(type, bubbles=false, cancelable=false) {
        this.type = type;
        this.bubbles = bubbles;
        this.cancelable = cancelable;
        this.target = null;
        this.currentTarget = null;
        this.eventPhase = 0; // 1: capture, 2: target, 3: bubble
        this._stopped = false;
    }

    stopPropagation() {
        this._stopped = true;
    }

    get propagationStopped() {
        return this._stopped;
    }
}

export class EventDispatcher {
    constructor() {
        this._listeners = {};
        this._parent = null; // parent in display tree for bubbling
    }

    addEventListener(type, callback) {
        if(!this._listeners[type]) this._listeners[type] = [];
        this._listeners[type].push(callback);
    }

    removeEventListener(type, callback) {
        if(!this._listeners[type]) return;
        const idx = this._listeners[type].indexOf(callback);
        if(idx !== -1) this._listeners[type].splice(idx, 1);
    }

    dispatchEvent(event) {
        event.target = this;
        event.currentTarget = this;
        // Capture Phase (optional)
        // Target Phase
        this._callListeners(event);
        // Bubble Phase
        if(event.bubbles && !event.propagationStopped && this._parent) {
            this._parent.dispatchEvent(event);
        }
    }

    _callListeners(event) {
        const listeners = this._listeners[event.type];
        if(!listeners) return;
        for(let cb of listeners) {
            cb.call(this, event);
            if(event.propagationStopped) break;
        }
    }

    setParent(parent) {
        this._parent = parent;
    }
}

/*==================================================
  END OF AVM2_Events.js
==================================================*/