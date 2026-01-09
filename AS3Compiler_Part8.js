/*==================================================
  AS3Compiler_Part8.js
  TextField + TextFormat + Fonts + Input Handling - Part 8
==================================================*/

import {EventDispatcher, Event} from './AS3Compiler_Part7.js';

export class TextFormat {
    constructor(font="Arial", size=12, color="#000000", bold=false, italic=false, underline=false) {
        this.font = font;
        this.size = size;
        this.color = color;
        this.bold = bold;
        this.italic = italic;
        this.underline = underline;
    }
}

export class TextField extends EventDispatcher {
    constructor(width=100, height=20, text=""){
        super();
        this.width = width;
        this.height = height;
        this.text = text;
        this.textFormat = new TextFormat();
        this.type = "dynamic"; // dynamic or input
        this.editable = false;
        this.cursorPos = 0;
        this.focused = false;
    }

    setText(value){
        this.text = value;
        this.dispatchEvent(new Event("change"));
    }

    appendText(value){
        this.text += value;
        this.dispatchEvent(new Event("change"));
    }

    setTextFormat(format){
        this.textFormat = format;
        this.dispatchEvent(new Event("formatChange"));
    }

    getText(){
        return this.text;
    }

    setType(type){
        if(type === "input"){
            this.type = "input";
            this.editable = true;
        } else {
            this.type = "dynamic";
            this.editable = false;
        }
    }

    focus(){
        this.focused = true;
        this.dispatchEvent(new Event("focus"));
    }

    blur(){
        this.focused = false;
        this.dispatchEvent(new Event("blur"));
    }

    handleInput(key){
        if(!this.editable || !this.focused) return;
        if(key === "Backspace"){
            this.text = this.text.slice(0, -1);
        } else {
            this.text += key;
        }
        this.dispatchEvent(new Event("change"));
    }
}

/*==================================================
  END OF AS3Compiler_Part8.js
==================================================*/