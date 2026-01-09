/*==================================================
  SWFParser(1).js
  Full AS3 SWF Parser - Part 1
  Parses SWF header and main tags
==================================================*/

import { DisplayObject, Sprite, MovieClip } from "./Display(1).js";
import { Sound } from "./AudioSystem.js";

export class SWFParser {
    constructor(arrayBuffer) {
        this.data = new DataView(arrayBuffer);
        this.offset = 0;
        this.tags = [];
        this.width = 0;
        this.height = 0;
        this.frameRate = 0;
        this.frameCount = 0;
    }

    readHeader() {
        const sig = String.fromCharCode(this.data.getUint8(0)) +
                    String.fromCharCode(this.data.getUint8(1)) +
                    String.fromCharCode(this.data.getUint8(2));
        if(sig !== 'FWS' && sig !== 'CWS') throw new Error("Not a valid SWF file");
        this.version = this.data.getUint8(3);
        this.fileLength = this.data.getUint32(4, true);
        this.offset = 8; // بعد الهيدر

        // إذا مضغوط CWS، نقوم بفك الضغط لاحقًا
        if(sig === 'CWS') {
            console.warn("Compressed SWF detected - decompression needed");
        }
    }

    parseRect() {
        const nbits = this.data.getUint8(this.offset) >> 3;
        const byteLen = Math.ceil((nbits*4+5)/8);
        this.offset += byteLen;
    }

    parseFrameRate() {
        this.frameRate = this.data.getUint16(this.offset, true)/256;
        this.offset += 2;
    }

    parseFrameCount() {
        this.frameCount = this.data.getUint16(this.offset, true);
        this.offset += 2;
    }

    parseTags() {
        while(this.offset < this.data.byteLength) {
            const recordHeader = this.data.getUint16(this.offset, true);
            const tagType = recordHeader >> 6;
            let tagLength = recordHeader & 0x3F;
            this.offset += 2;
            if(tagLength === 0x3F) {
                tagLength = this.data.getUint32(this.offset, true);
                this.offset += 4;
            }

            const tagData = new DataView(this.data.buffer, this.offset, tagLength);
            this.tags.push({ type: tagType, data: tagData });
            this.offset += tagLength;
        }
    }

    buildDisplayObjects() {
        const root = new MovieClip();
        for(let tag of this.tags) {
            switch(tag.type) {
                case 1: // ShowFrame
                    root.addFrame();
                    break;
                case 2: // DefineShape
                    // Placeholder: connect مع Display Graphics
                    break;
                case 4: // PlaceObject
                    // Placeholder: PlaceObject على Display hierarchy
                    break;
                case 11: // DefineText
                    // Placeholder: connect مع TextField
                    break;
                case 12: // DoAction / DoABC
                    // Placeholder: سيتم مع AVM2/ABCInterpreter
                    break;
                case 39: // DefineSprite
                    // Placeholder: إنشاء Sprite جديد
                    break;
                case 43: // DefineFont
                    // Placeholder: load font
                    break;
                case 14: // SoundStreamHead
                case 15: // SoundStreamBlock
                case 19: // DefineSound
                    // Placeholder: connect مع AudioSystem
                    break;
            }
        }
        return root;
    }

    parse() {
        this.readHeader();
        this.parseRect();
        this.parseFrameRate();
        this.parseFrameCount();
        this.parseTags();
        return this.buildDisplayObjects();
    }
}

/*==================================================
  END OF SWFParser(1).js
==================================================*/