/*==================================================
  MovieClip.js
  Ultimate AS3 MovieClip Timeline & Display System
  Flash-accurate + GPU + Filters + Mask
==================================================*/

import { FilterManager } from "./FilterManager.js";

/*==================== Frame ====================*/
export class Frame {
    constructor(label = "", duration = 1, actions = [], children = []) {
        this.label = label;
        this.duration = duration;   // عدد التكات
        this.actions = actions;     // frame scripts
        this.children = children;   // DisplayObjects
    }
}

/*==================== MovieClip ====================*/
export class MovieClip {

    constructor(renderer) {
        this.renderer = renderer;

        // Timeline
        this.frames = [];
        this.currentFrame = 0;
        this.currentTick = 0;
        this.playing = true;
        this.loop = true;

        // Visibility
        this.visible = true;

        // Transform (Flash style)
        this.x = 0;
        this.y = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.rotation = 0; // degrees
        this.alpha = 1;

        // Display
        this.width = 100;
        this.height = 100;
        this.texture = null;
        this.blendMode = "NORMAL";

        // Hierarchy
        this.children = [];

        // Effects
        this.filters = [];
        this.mask = null;
    }

    /*================ Timeline =================*/
    addFrame(frame) {
        this.frames.push(frame);
    }

    play() { this.playing = true; }
    stop() { this.playing = false; }

    gotoAndStop(frameOrLabel) {
        this._goto(frameOrLabel);
        this.stop();
    }

    gotoAndPlay(frameOrLabel) {
        this._goto(frameOrLabel);
        this.play();
    }

    _goto(frameOrLabel) {
        if (typeof frameOrLabel === "number") {
            this.currentFrame = Math.max(0, frameOrLabel % this.frames.length);
        } else {
            const i = this.frames.findIndex(f => f.label === frameOrLabel);
            if (i !== -1) this.currentFrame = i;
        }

        this.currentTick = 0;
        this._updateChildren();
        this._runFrameActions();
    }

    nextFrame() {
        this.currentFrame++;
        if (this.currentFrame >= this.frames.length) {
            this.currentFrame = this.loop ? 0 : this.frames.length - 1;
        }
        this.currentTick = 0;
        this._updateChildren();
        this._runFrameActions();
    }

    /*================ Frame logic =================*/
    _updateChildren() {
        const f = this.frames[this.currentFrame];
        this.children = f ? [...f.children] : [];
    }

    _runFrameActions() {
        const f = this.frames[this.currentFrame];
        if (!f) return;
        for (const act of f.actions) {
            try { act(this); }
            catch (e) { console.error("Frame script error:", e); }
        }
    }

    /*================ Display list =================*/
    addChild(obj) {
        this.children.push(obj);
    }

    removeChild(obj) {
        const i = this.children.indexOf(obj);
        if (i !== -1) this.children.splice(i, 1);
    }

    /*================ Filters =================*/
    addFilter(filter) {
        this.filters.push(filter);
    }

    removeFilter(filter) {
        const i = this.filters.indexOf(filter);
        if (i !== -1) this.filters.splice(i, 1);
    }

    clearFilters() {
        this.filters.length = 0;
    }

    setMask(mask) {
        this.mask = mask;
    }

    /*================ Update & Render =================*/
    update() {
        if (!this.visible || this.frames.length === 0) return;

        // Timeline advance
        if (this.playing) {
            this.currentTick++;
            const f = this.frames[this.currentFrame];
            if (this.currentTick >= f.duration) {
                this.nextFrame();
            }
        }

        if (!this.renderer || !this.texture) return;

        // Mask
        if (this.mask) this.renderer.applyMask(this.mask);

        // Filters (prepare shaders)
        for (const f of this.filters) {
            FilterManager.apply(this.renderer, f);
        }

        // Draw self
        this.renderer.drawTexture(
            this.texture,
            this.x,
            this.y,
            this.width * this.scaleX,
            this.height * this.scaleY,
            this.blendMode,
            this.alpha,
            this.rotation
        );

        // Children (Flash-style hierarchy)
        for (const child of this.children) {
            if (child.update) child.update();
        }

        if (this.mask) this.renderer.clearMask();
    }

    /*================ Info =================*/
    get totalFrames() {
        return this.frames.length;
    }

    get currentFrameLabel() {
        const f = this.frames[this.currentFrame];
        return f ? f.label : null;
    }
}

/*==================================================
  END OF MovieClip.js
==================================================*/