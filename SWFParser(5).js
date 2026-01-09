/*==================================================
  SWFParser(5).js
  Full AS3 SWF Parser - Part 5
  Linking everything with AVM2 for full AS3 support
==================================================*/

import { SWFParser } from "./SWFParser(1).js";
import { SWFParser2 } from "./SWFParser(2).js";
import { SWFParser3 } from "./SWFParser(3).js";
import { SWFParser4 } from "./SWFParser(4).js";
import { AVM2 } from "./AVM2.js";
import { MovieClip } from "./Display(1).js";

export class SWFParser5 {
    constructor(arrayBuffer) {
        this.arrayBuffer = arrayBuffer;

        // Step 1: Parse basic SWF
        this.parser1 = new SWFParser(arrayBuffer);
        this.rootTags = this.parser1.parse();

        // Step 2: Parse Graphics
        this.parser2 = new SWFParser2(this.rootTags.tags);
        this.parser2.parseShapes();
        this.parser2.parseBitmaps();
        this.graphicsLibrary = this.parser2.getGraphicsLibrary();

        // Step 3: Parse Texts
        this.parser3 = new SWFParser3(this.rootTags.tags, this.graphicsLibrary);
        const { fonts, textFields } = this.parser3.parseAll();
        this.fontLibrary = fonts;
        this.textFields = textFields;

        // Step 4: Parse FrameScripts
        this.parser4 = new SWFParser4(this.rootTags.tags, this.graphicsLibrary, this.textFields);
        const { frameScripts, movieClips } = this.parser4.parseAll();
        this.frameScripts = frameScripts;
        this.movieClips = movieClips;

        // Step 5: Initialize AVM2 engine
        this.avm2 = new AVM2();
        this.avm2.loadABC(frameScripts.filter(f => f.type === "ActionScript3"));
    }

    buildRootMovieClip() {
        const root = new MovieClip();
        // ربط كل Graphics و TextFields و MovieClips
        for(let clipId in this.movieClips) {
            const clip = this.movieClips[clipId];
            root.addChild(clip);
        }
        return root;
    }

    play() {
        const rootClip = this.buildRootMovieClip();
        // Start executing scripts via AVM2
        this.avm2.run(rootClip);
        return rootClip;
    }
}

/*==================================================
  END OF SWFParser(5).js
==================================================*/