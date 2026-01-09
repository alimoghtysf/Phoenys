/*==================================================
  KeyboardManager.js
  Handles Keyboard Input
==================================================*/

import {KeyboardEvent} from './KeyboardEvent.js';

export class KeyboardManager {
    constructor(){
        this.keysDown = {};
        this.listeners = {};

        window.addEventListener("keydown", (e)=>this._onKeyDown(e));
        window.addEventListener("keyup", (e)=>this._onKeyUp(e));
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

    _onKeyDown(e){
        this.keysDown[e.code] = true;
        const event = new KeyboardEvent("keydown", e.code.charCodeAt(0), e.keyCode);
        event.altKey = e.altKey;
        event.ctrlKey = e.ctrlKey;
        event.shiftKey = e.shiftKey;
        this._dispatch("keydown", event);
    }

    _onKeyUp(e){
        delete this.keysDown[e.code];
        const event = new KeyboardEvent("keyup", e.code.charCodeAt(0), e.keyCode);
        event.altKey = e.altKey;
        event.ctrlKey = e.ctrlKey;
        event.shiftKey = e.shiftKey;
        this._dispatch("keyup", event);
    }
}