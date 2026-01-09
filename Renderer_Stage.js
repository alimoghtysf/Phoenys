/*==================================================
  Renderer_Stage.js
  Main Stage - Manages all DisplayObjects and Events
==================================================*/

import { RendererMovieClip } from "./Renderer_MovieClip.js";
import { RendererSprite } from "./Renderer_Sprite.js";
import { RendererBitmap } from "./Renderer_Bitmap.js";
import { RendererText } from "./Renderer_Text.js";
import { RendererFilters } from "./Renderer_Filters.js";
import { RendererMasks } from "./Renderer_Masks.js";

export class Stage {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.children = [];
        this.filters = new RendererFilters();
        this.masks = new RendererMasks();
        this.movieClipRenderer = new RendererMovieClip();
        this.spriteRenderer = new RendererSprite();
        this.bitmapRenderer = new RendererBitmap();
        this.textRenderer = new RendererText();
        this.lastTime = performance.now();
        this.fps = 60;
    }

    // ================= Add Child =================
    addChild(obj) {
        if(!this.children) this.children = [];
        this.children.push(obj);
    }

    removeChild(obj) {
        if(!this.children) return;
        const index = this.children.indexOf(obj);
        if(index >= 0) this.children.splice(index, 1);
    }

    // ================= Main Render Loop =================
    render() {
        const now = performance.now();
        const delta = now - this.lastTime;
        if(delta < 1000 / this.fps) return; // simple fps limiter
        this.lastTime = now;

        // Clear Stage
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw all children
        for(let obj of this.children) {
            this.masks.drawWithMask(this.ctx, obj, () => {
                this.filters.applyFilters(this.ctx, obj);

                if(obj.type === "MovieClip") this.movieClipRenderer.draw(this.ctx, obj);
                else if(obj.type === "Sprite") this.spriteRenderer.draw(this.ctx, obj);
                else if(obj.type === "Bitmap") this.bitmapRenderer.draw(this.ctx, obj);
                else if(obj.type === "TextField") this.textRenderer.draw(this.ctx, obj);

                this.filters.reset(this.ctx);
            });
        }
    }

    // ================= Start Loop =================
    start() {
        const loop = () => {
            this.render();
            requestAnimationFrame(loop);
        };
        loop();
    }
}

/*==================================================
  END OF Renderer_Stage.js
==================================================*/