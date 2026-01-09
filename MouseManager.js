/*==================================================
  MouseManager.js
  Handles Mouse Input on Stage
==================================================*/

import {MouseEvent} from './MouseEvent.js';

export class MouseManager {
    constructor(stage){
        this.stage = stage;
        this.mouseX = 0;
        this.mouseY = 0;
        this.isDown = false;
        this.listeners = {};

        window.addEventListener("mousemove", (e) => this._onMouseMove(e));
        window.addEventListener("mousedown", (e) => this._onMouseDown(e));
        window.addEventListener("mouseup", (e) => this._onMouseUp(e));
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

    _onMouseMove(e){
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        this._dispatch("mousemove", new MouseEvent("mousemove", e.clientX, e.clientY, this.isDown));
    }

    _onMouseDown(e){
        this.isDown = true;
        this._dispatch("mousedown", new MouseEvent("mousedown", e.clientX, e.clientY, true));
    }

    _onMouseUp(e){
        this.isDown = false;
        this._dispatch("mouseup", new MouseEvent("mouseup", e.clientX, e.clientY, false));
        this._dispatch("click", new MouseEvent("click", e.clientX, e.clientY, false));
    }
}