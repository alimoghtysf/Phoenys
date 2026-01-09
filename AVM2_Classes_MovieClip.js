/*==================================================
  AVM2_Classes_MovieClip.js
  MovieClip + Timeline + Frame Scripts
==================================================*/

import {Sprite, InteractiveObject} from './AVM2_Classes_Core.js';

export class Frame {
    constructor(label=null, script=null) {
        this.label = label;      // اسم الفريم
        this.script = script;    // دالة ActionScript للـ frame
    }
}

export class Timeline {
    constructor() {
        this.frames = [];
        this.currentFrameIndex = 0;
    }

    addFrame(frame) {
        this.frames.push(frame);
    }

    gotoAndPlay(frame) {
        if(typeof frame === 'string') {
            const index = this.frames.findIndex(f=>f.label===frame);
            if(index>=0) this.currentFrameIndex = index;
        } else if(typeof frame === 'number') {
            if(frame>=0 && frame<this.frames.length) this.currentFrameIndex = frame;
        }
    }

    gotoAndStop(frame) {
        this.gotoAndPlay(frame);
        this.stop = true;
    }

    nextFrame() {
        this.currentFrameIndex++;
        if(this.currentFrameIndex >= this.frames.length) this.currentFrameIndex = 0;
    }

    get currentFrame() {
        return this.frames[this.currentFrameIndex];
    }
}

export class MovieClip extends Sprite {
    constructor() {
        super();
        this.timeline = new Timeline();
        this.playing = true;
        this.frameRate = 24; // default
        this.elapsed = 0;
    }

    enterFrame(deltaTime=1000/24) {
        if(!this.playing) return;
        this.elapsed += deltaTime;
        if(this.elapsed >= 1000/this.frameRate) {
            this.elapsed = 0;
            this.timeline.nextFrame();
            // تشغيل سكربت الفريم
            const frame = this.timeline.currentFrame;
            if(frame && typeof frame.script === 'function') {
                frame.script();
            }
        }
    }

    play() { this.playing = true; }
    stop() { this.playing = false; }
}

/*==================================================
  END OF AVM2_Classes_MovieClip.js
==================================================*/