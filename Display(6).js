/*==================================================
  Display(6).js
  Display core for AS3 full support (PART 6)
  Advanced Text & Embedded Fonts
==================================================*/

import { DisplayObject, Graphics } from "./Display(1).js";

// ===================== TextField ===================
export class TextField extends DisplayObject {
    constructor() {
        super();
        this.text = "";
        this.textColor = "#000000";
        this.fontSize = 12;
        this.fontFamily = "Arial";
        this.bold = false;
        this.italic = false;
        this.multiline = false;
        this.wordWrap = false;
        this.embedFonts = false;
        this.maxWidth = 0;
        this.maxHeight = 0;
    }

    setText(value) {
        this.text = value;
    }

    setStyle({color, size, font, bold=false, italic=false}) {
        if(color) this.textColor = color;
        if(size) this.fontSize = size;
        if(font) this.fontFamily = font;
        this.bold = bold;
        this.italic = italic;
    }

    _render(ctx) {
        if(!this.visible) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.globalAlpha *= this.alpha;

        let fontStr = `${this.bold ? "bold " : ""}${this.italic ? "italic " : ""}${this.fontSize}px ${this.fontFamily}`;
        ctx.font = fontStr;
        ctx.fillStyle = this.textColor;
        ctx.textBaseline = "top";

        let lines = this.text.split("\n");
        if(this.wordWrap && this.maxWidth > 0){
            let wrapped = [];
            for(let line of lines){
                let words = line.split(" ");
                let currentLine = "";
                for(let word of words){
                    let testLine = currentLine + word + " ";
                    if(ctx.measureText(testLine).width > this.maxWidth){
                        wrapped.push(currentLine);
                        currentLine = word + " ";
                    } else {
                        currentLine = testLine;
                    }
                }
                wrapped.push(currentLine);
            }
            lines = wrapped;
        }

        let yOffset = 0;
        for(let line of lines){
            ctx.fillText(line, 0, yOffset);
            yOffset += this.fontSize * 1.2;
            if(this.maxHeight > 0 && yOffset > this.maxHeight) break;
        }

        ctx.restore();

        // Render children if any
        for (let child of this.children) {
            child._render(ctx);
        }
    }
}

// ===================== Embedded Fonts ===================
export class FontLibrary {
    constructor() {
        this.fonts = {}; // name -> FontFace or object
    }

    registerFont(name, fontFace) {
        this.fonts[name] = fontFace;
        if(fontFace instanceof FontFace){
            document.fonts.add(fontFace);
        }
    }

    getFont(name) {
        return this.fonts[name] || null;
    }
}

export const fontLibrary = new FontLibrary();

/*==================================================
  END OF Display(6).js
==================================================*/