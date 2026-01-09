/*==================================================
  MovieClip_Timeline.js
  Full MovieClip + Timeline + Frame Scripts for AS3
==================================================*/

import {SpriteRenderer, StageRenderer} from './Renderer_Advanced.js';
import {EventDispatcher} from './EventDispatcher.js';

export class Frame {
    constructor(label="", duration=1, script=null) {
        this.label = label;
        this.duration = duration; // frames
        this.script = script;     // function to execute
    }
}

export class Timeline {
    constructor() {
        this.frames = [];
        this.currentFrameIndex = 0;
        this.loop = true;
        this.onComplete = null;
    }

    addFrame(frame) {
        this.frames.push(frame);
    }

    gotoFrame(indexOrLabel) {
        if(typeof indexOrLabel === "number") {
            this.currentFrameIndex = Math.max(0, Math.min(indexOrLabel, this.frames.length -1));
        } else {
            const idx = this.frames.findIndex(f=>f.label === indexOrLabel);
            if(idx>=0) this.currentFrameIndex = idx;
        }
        this.runFrameScript();
    }

    nextFrame() {
        this.currentFrameIndex++;
        if(this.currentFrameIndex >= this.frames.length) {
            if(this.loop) this.currentFrameIndex = 0;
            else {
                this.currentFrameIndex = this.frames.length - 1;
                if(this.onComplete) this.onComplete();
            }
        }
        this.runFrameScript();
    }

    runFrameScript() {
        const frame = this.frames[this.currentFrameIndex];
        if(frame && frame.script) {
            try { frame.script(); } 
            catch(e) { console.error("Frame Script Error:", e); }
        }
    }
}

// ===================== MovieClip =====================
export class MovieClip extends SpriteRenderer {
    constructor() {
        super();
        this.timeline = new Timeline();
        this.isPlaying = true;
        this.fps = 24;
        this.eventDispatcher = new EventDispatcher();
    }

    play() {
        this.isPlaying = true;
    }

    stop() {
        this.isPlaying = false;
    }

    gotoAndStop(frame) {
        this.timeline.gotoFrame(frame);
        this.stop();
    }

    gotoAndPlay(frame) {
        this.timeline.gotoFrame(frame);
        this.play();
    }

    addFrame(label="", duration=1, script=null) {
        const frame = new Frame(label, duration, script);
        this.timeline.addFrame(frame);
    }

    update() {
        if(this.isPlaying) this.timeline.nextFrame();
    }

    render(ctx) {
        super.render(ctx);
        this.update();
    }

    addEventListener(type, listener) {
        this.eventDispatcher.addEventListener(type, listener);
    }

    dispatchEvent(event) {
        this.eventDispatcher.dispatchEvent(event);
    }
}

/*==================================================
  END OF MovieClip_Timeline.js
==================================================*/