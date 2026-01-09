/*==================================================
  SWFParser(3).js
  Full AS3 SWF Parser - Part 3
  Parsing TextFields & Fonts
==================================================*/

import { TextField, TextFormat, Font } from "./Display(1).js";

export class SWFParser3 {
    constructor(tags, graphicsLibrary) {
        this.tags = tags;                 // من SWFParser(1)
        this.graphicsLibrary = graphicsLibrary; // من SWFParser(2)
        this.fontLibrary = {};            // id -> Font
        this.textFields = {};             // id -> TextField
    }

    parseFonts() {
        for(let tag of this.tags) {
            if(tag.type === 10 || tag.type === 48) { // DefineFont / DefineFont2
                const fontId = this._readID(tag.data);
                const font = this._parseFont(tag.data);
                this.fontLibrary[fontId] = font;
            }
        }
    }

    parseTextFields() {
        for(let tag of this.tags) {
            if(tag.type === 11) { // DefineText
                const textId = this._readID(tag.data);
                const tf = this._parseText(tag.data);
                this.textFields[textId] = tf;
            }
            if(tag.type === 33) { // DefineText2
                const textId = this._readID(tag.data);
                const tf = this._parseText(tag.data);
                this.textFields[textId] = tf;
            }
        }
    }

    _readID(data) {
        // Placeholder: قراءة الـ ID من DataView
        return data.getUint16(0, true);
    }

    _parseFont(data) {
        // Placeholder: parse font name, style, glyphs
        const font = new Font();
        font.name = "DefaultFont"; // استبدلي بالقراءة الحقيقية من tag
        font.glyphs = []; // Glyph data من tag
        return font;
    }

    _parseText(data) {
        const tf = new TextField();
        tf.text = "Hello World"; // placeholder: parse actual text
        tf.format = new TextFormat();
        tf.format.font = this.fontLibrary[1] || null;
        tf.format.size = 12;
        tf.format.color = 0x000000;
        tf.format.bold = false;
        tf.format.italic = false;
        return tf;
    }

    getFonts() {
        return this.fontLibrary;
    }

    getTextFields() {
        return this.textFields;
    }

    parseAll() {
        this.parseFonts();
        this.parseTextFields();
        return { fonts: this.fontLibrary, textFields: this.textFields };
    }
}

/*==================================================
  END OF SWFParser(3).js
==================================================*/