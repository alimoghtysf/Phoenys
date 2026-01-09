/*==================================================
  Renderer_Advanced.js
  Full Renderer: Bitmap, Stage, Sprites, Masks, Filters
==================================================*/

import {DisplayObject, Sprite, Stage} from './AVM2_Classes_Core.js';

// ===================== Bitmap =====================
export class Bitmap extends DisplayObject {
    constructor(imgSrc=null) {
        super();
        this.image = null;
        if(imgSrc) this.load(imgSrc);
    }

    load(src) {
        this.image = new Image();
        this.image.src = src;
    }

    render(ctx) {
        if(!ctx || !this.image) return;
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.transform(this.scaleX, 0, 0, this.scaleY, this.x, this.y);
        ctx.drawImage(this.image, 0, 0, this.width || this.image.width, this.height || this.image.height);
        ctx.restore();
    }
}

// ===================== Filters =====================
export class Filter {
    constructor(type="none", params={}) {
        this.type = type; // blur, glow, dropShadow, colorMatrix
        this.params = params;
    }

    apply(ctx, obj) {
        switch(this.type) {
            case "blur":
                ctx.filter = `blur(${this.params.radius || 5}px)`;
                break;
            case "grayscale":
                ctx.filter = "grayscale(100%)";
                break;
            default:
                ctx.filter = "none";
        }
    }
}

// ===================== Mask =====================
export class Mask {
    constructor(shape=null) {
        this.shape = shape; // أي DisplayObject
    }

    apply(ctx, obj) {
        if(!ctx || !this.shape) return;
        ctx.save();
        ctx.beginPath();
        // نفترض شكل بسيط rectangle أو path
        ctx.rect(this.shape.x, this.shape.y, this.shape.width, this.shape.height);
        ctx.clip();
    }

    remove(ctx) {
        if(!ctx) return;
        ctx.restore();
    }
}

// ===================== Stage =====================
export class StageRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.children = [];
        this.clearColor = "#ffffff";
    }

    addChild(obj) {
        this.children.push(obj);
    }

    removeChild(obj) {
        const idx = this.children.indexOf(obj);
        if(idx>=0) this.children.splice(idx, 1);
    }

    render() {
        if(!this.ctx) return;
        const ctx = this.ctx;
        ctx.save();
        ctx.fillStyle = this.clearColor;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        for(let child of this.children) {
            if(child instanceof Mask && child.shape) {
                child.apply(ctx, child.shape);
            } else if(typeof child.render === 'function') {
                child.render(ctx);
            }
        }
        ctx.restore();
    }
}

// ===================== Sprite Rendering =====================
export class SpriteRenderer extends Sprite {
    constructor() {
        super();
    }

    render(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        for(let child of this.children) {
            if(typeof child.render === 'function') child.render(ctx);
        }
        ctx.restore();
    }
}

/*==================================================
  END OF Renderer_Advanced.js
==================================================*/