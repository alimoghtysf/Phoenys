/*==================================================
  Display(2).js
  Display core for AS3 full support (PART 2)
==================================================*/

import { DisplayObject, Sprite, Graphics } from "./Display(1).js";

export class Frame {
    constructor(label = "", actions = []) {
        this.label = label;
        this.actions = actions; // AVM2 Actions for frame
    }
}

export class Timeline {
    constructor() {
        this.frames = [];
        this.currentFrame = 0;
        this.playing = true;
    }

    addFrame(frame) {
        this.frames.push(frame);
    }

    gotoAndPlay(frameNumber) {
        if (frameNumber < 0 || frameNumber >= this.frames.length) return;
        this.currentFrame = frameNumber;
        this.playing = true;
    }

    gotoAndStop(frameNumber) {
        if (frameNumber < 0 || frameNumber >= this.frames.length) return;
        this.currentFrame = frameNumber;
        this.playing = false;
    }

    nextFrame() {
        if (!this.playing) return;
        this.currentFrame++;
        if (this.currentFrame >= this.frames.length) {
            this.currentFrame = 0;
        }
    }

    get current() {
        return this.frames[this.currentFrame];
    }
}

export class MovieClip extends Sprite {
    constructor() {
        super();
        this.timeline = new Timeline();
        this.frameRate = 24;
        this._lastTime = performance.now();
        this._startTimeline();
    }

    _startTimeline() {
        const loop = (time) => {
            const dt = (time - this._lastTime) / 1000;
            if (dt >= 1 / this.frameRate) {
                this.timeline.nextFrame();
                this._lastTime = time;
            }
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }

    gotoAndPlay(frameNumber) {
        this.timeline.gotoAndPlay(frameNumber);
    }

    gotoAndStop(frameNumber) {
        this.timeline.gotoAndStop(frameNumber);
    }

    _render(ctx) {
        if (!this.visible) return;
        ctx.save();
        ctx.globalAlpha *= this.alpha;
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.scale(this.scaleX, this.scaleY);

        this.graphics._draw(ctx); // رسم المحتوى الأساسي
        // رسم الأطفال
        for (let child of this.children) {
            child._render(ctx);
        }

        ctx.restore();
    }
}

/*==================================================
  END OF Display(2).js
==================================================*/