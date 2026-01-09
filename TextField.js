/*==================================================
  TextField.js
  Full AS3 TextField Implementation
==================================================*/

import {TextFormat} from './TextFormat.js';
import {EventDispatcher} from './EventDispatcher.js';

export class TextField extends EventDispatcher {
    constructor(width=200, height=50, text=""){
        super();
        this.width = width;
        this.height = height;
        this.text = text;
        this.defaultTextFormat = new TextFormat();
        this.html = false;
        this.selectable = false;
        this.multiline = false;
        this.wordWrap = false;
        this.background = false;
        this.backgroundColor = "#FFFFFF";
        this.border = false;
        this.borderColor = "#000000";
        this._canvas = null;  // will be assigned by Renderer
    }

    setTextFormat(format){
        this.defaultTextFormat = format;
        this._render();
    }

    setHTML(value){
        this.html = true;
        this.text = value;
        this._render();
    }

    setText(value){
        this.html = false;
        this.text = value;
        this._render();
    }

    _render(){
        if(!this._canvas) return;
        const ctx = this._canvas.getContext("2d");
        ctx.clearRect(0,0,this.width,this.height);

        if(this.background){
            ctx.fillStyle = this.backgroundColor;
            ctx.fillRect(0,0,this.width,this.height);
        }

        ctx.font = `${this.defaultTextFormat.bold ? "bold " : ""}${this.defaultTextFormat.italic ? "italic " : ""}${this.defaultTextFormat.size}px ${this.defaultTextFormat.font}`;
        ctx.fillStyle = this.defaultTextFormat.color;
        ctx.textAlign = this.defaultTextFormat.align;
        
        const lines = this.text.split("\n");
        let y = this.defaultTextFormat.size;

        for(let line of lines){
            ctx.fillText(line, this.width/2, y);
            y += this.defaultTextFormat.size + this.defaultTextFormat.leading;
        }
    }

    attachCanvas(canvas){
        this._canvas = canvas;
        this._render();
    }
}