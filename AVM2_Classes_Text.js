/*==================================================
  AVM2_Classes_Text.js
  Full TextField + Fonts + Rendering for AS3
==================================================*/

import {DisplayObject, InteractiveObject} from './AVM2_Classes_Core.js';
import {Renderer} from './Renderer_Core.js';

// ===================== TextFormat =====================
export class TextFormat {
    constructor(font="Arial", size=12, color="#000000", bold=false, italic=false, underline=false, align="left") {
        this.font = font;
        this.size = size;
        this.color = color;
        this.bold = bold;
        this.italic = italic;
        this.underline = underline;
        this.align = align; // left | center | right
    }
}

// ===================== TextField =====================
export class TextField extends InteractiveObject {
    constructor(width=100, height=30) {
        super();
        this.text = "";
        this.width = width;
        this.height = height;
        this.multiline = false;
        this.wordWrap = false;
        this.selectable = false;
        this.type = "dynamic"; // dynamic | input
        this.defaultTextFormat = new TextFormat();
        this.textFormat = this.defaultTextFormat;
    }

    setTextFormat(format) {
        this.textFormat = format;
    }

    setText(text) {
        this.text = text;
    }

    appendText(text) {
        this.text += text;
    }

    clear() {
        this.text = "";
    }

    render(ctx) {
        if(!ctx) return;
        const tf = this.textFormat;
        ctx.save();
        ctx.font = `${tf.bold ? "bold" : ""} ${tf.italic ? "italic" : ""} ${tf.size}px ${tf.font}`;
        ctx.fillStyle = tf.color;
        ctx.textAlign = tf.align;
        const lines = this.multiline ? this.text.split("\n") : [this.text];
        let y = 0;
        for(let line of lines) {
            ctx.fillText(line, 0, y);
            y += tf.size * 1.2;
        }
        ctx.restore();
    }
}

// ===================== FontManager =====================
export class FontManager {
    constructor() {
        this.loadedFonts = {};
    }

    loadFont(name, url) {
        if(this.loadedFonts[name]) return;
        const newFont = new FontFace(name, `url(${url})`);
        newFont.load().then((loaded) => {
            document.fonts.add(loaded);
            this.loadedFonts[name] = true;
        }).catch(console.error);
    }
}

/*==================================================
  END OF AVM2_Classes_Text.js
==================================================*/