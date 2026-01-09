/*==================================================
  AS3Compiler_Part13.js
  TextField + TextFormat + HTMLText + Multiline + Font Embedding - Part 13
==================================================*/

import {DisplayObject} from './Display(1).js';

export class TextFormat {
    constructor(font="Arial", size=12, color=0x000000, bold=false, italic=false, underline=false, align="left") {
        this.font = font;
        this.size = size;
        this.color = color;
        this.bold = bold;
        this.italic = italic;
        this.underline = underline;
        this.align = align; // left, center, right
    }
}

export class TextField extends DisplayObject {
    constructor() {
        super();
        this.text = "";
        this.htmlText = "";
        this.multiline = false;
        this.wordWrap = false;
        this.selectable = false;
        this.textFormat = new TextFormat();
    }

    setTextFormat(format){
        this.textFormat = format;
    }

    setText(str){
        this.text = str;
        this.htmlText = str;
    }

    setHTMLText(str){
        this.htmlText = str;
        this.text = str.replace(/<[^>]*>/g, ''); // remove tags for plain text fallback
    }

    draw(ctx){
        if(!ctx) return;
        ctx.save();
        const tf = this.textFormat;
        ctx.font = `${tf.bold ? "bold" : ""} ${tf.italic ? "italic" : ""} ${tf.size}px ${tf.font}`;
        ctx.fillStyle = `#${(tf.color & 0xFFFFFF).toString(16).padStart(6,"0")}`;
        ctx.textAlign = tf.align;
        const lines = this.multiline ? this.text.split("\n") : [this.text];
        const lineHeight = tf.size * 1.2;
        lines.forEach((line, i)=>{
            ctx.fillText(line, this.x, this.y + i*lineHeight);
        });
        ctx.restore();
    }
}

/*==================================================
  END OF AS3Compiler_Part13.js
==================================================*/