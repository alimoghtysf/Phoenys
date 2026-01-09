/*==================================================
  SWFParser(4).js
  Full AS3 SWF Parser - Part 4
  Parsing FrameScripts & DoAction / DoABC
==================================================*/

import { EventDispatcher } from "./EventDispatcher.js";
import { MovieClip } from "./Display(1).js";

export class SWFParser4 {
    constructor(tags, graphicsLibrary, textFields) {
        this.tags = tags;                 // من SWFParser(1)
        this.graphicsLibrary = graphicsLibrary; // من SWFParser(2)
        this.textFields = textFields;     // من SWFParser(3)
        this.frameScripts = [];           // store frame actions
        this.movieClips = {};             // id -> MovieClip
    }

    parseFrameScripts() {
        for(let tag of this.tags) {
            switch(tag.type) {
                case 12: // DoAction
                case 82: // DoABC
                    const script = this._parseScript(tag.data);
                    this.frameScripts.push(script);
                    break;
                case 39: // DefineSprite
                    const spriteId = this._readID(tag.data);
                    const clip = this._parseSprite(tag.data);
                    this.movieClips[spriteId] = clip;
                    break;
                case 1: // ShowFrame
                    this.frameScripts.push({ type: "ShowFrame" });
                    break;
            }
        }
    }

    _readID(data) {
        return data.getUint16(0, true);
    }

    _parseScript(data) {
        // Placeholder: هنا نحتفظ بالـ bytecode أو Actions لتشغيلها لاحقًا مع AVM2
        return {
            type: "ActionScript3",
            data: data
        };
    }

    _parseSprite(data) {
        const clip = new MovieClip();
        // Placeholder: parse child tags, frames, graphics, textFields
        return clip;
    }

    getFrameScripts() {
        return this.frameScripts;
    }

    getMovieClips() {
        return this.movieClips;
    }

    parseAll() {
        this.parseFrameScripts();
        return {
            frameScripts: this.frameScripts,
            movieClips: this.movieClips
        };
    }
}

/*==================================================
  END OF SWFParser(4).js
==================================================*/