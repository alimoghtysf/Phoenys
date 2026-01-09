/*==================================================
  TouchManager.js
  Handles Touch Input on Stage
==================================================*/

import {TouchEvent} from './TouchEvent.js';

export class TouchManager {
    constructor(stage){
        this.stage = stage;
        this.listeners = {};

        window.addEventListener("touchstart", e=>this._onTouch(e));
        window.addEventListener("touchmove", e=>this._onTouch(e));
        window.addEventListener("touchend", e=>this._onTouchEnd(e));
    }

    addEventListener(type, callback){
        if(!this.listeners[type]) this.listeners[type] = [];
        this.listeners[type].push(callback);
    }

    _dispatch(type, event){
        if(this.listeners[type]){
            for(let cb of this.listeners[type]) cb(event);
        }
    }

    _onTouch(e){
        e.preventDefault();
        for(let t of e.changedTouches){
            const ev = new TouchEvent(e.type, t.clientX, t.clientY, t.identifier);
            this._dispatch(e.type, ev);
        }
    }

    _onTouchEnd(e){
        e.preventDefault();
        for(let t of e.changedTouches){
            const ev = new TouchEvent("touchend", t.clientX, t.clientY, t.identifier);
            this._dispatch("touchend", ev);
        }
    }
}