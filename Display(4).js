/*==================================================
  Display(4).js
  Display core for AS3 full support (PART 4)
==================================================*/

import { DisplayObject, Graphics, MovieClip, ColorTransform, BlurFilter, DropShadowFilter } from "./Display(1).js";

// ===================== Composite & BlendModes ===================
DisplayObject.prototype.blendMode = "normal"; // normal, multiply, screen, overlay, lighten, darken, difference, add

DisplayObject.prototype._applyBlendMode = function(ctx) {
    switch(this.blendMode) {
        case "normal": ctx.globalCompositeOperation = "source-over"; break;
        case "multiply": ctx.globalCompositeOperation = "multiply"; break;
        case "screen": ctx.globalCompositeOperation = "screen"; break;
        case "overlay": ctx.globalCompositeOperation = "overlay"; break;
        case "lighten": ctx.globalCompositeOperation = "lighten"; break;
        case "darken": ctx.globalCompositeOperation = "darken"; break;
        case "difference": ctx.globalCompositeOperation = "difference"; break;
        case "add": ctx.globalCompositeOperation = "lighter"; break;
        default: ctx.globalCompositeOperation = "source-over"; break;
    }
};

// ===================== Advanced Transform ===================
DisplayObject.prototype.transform = {
    matrix: [1,0,0,1,0,0],
    colorTransform: new ColorTransform()
};

DisplayObject.prototype._applyTransform = function(ctx) {
    const m = this.transform.matrix;
    ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
};

// ===================== Filters Application ===================
DisplayObject.prototype._applyFilters = function(ctx) {
    if (!this.filters || this.filters.length === 0) return;
    for (let filter of this.filters) {
        if (filter instanceof BlurFilter) {
            ctx.filter = `blur(${filter.blurX}px)`;
        } else if (filter instanceof DropShadowFilter) {
            ctx.shadowColor = filter.color;
            ctx.shadowBlur = (filter.blurX + filter.blurY)/2;
            ctx.shadowOffsetX = filter.distance * Math.cos(filter.angle * Math.PI/180);
            ctx.shadowOffsetY = filter.distance * Math.sin(filter.angle * Math.PI/180);
        }
        // ColorTransform can be applied during draw (placeholder)
    }
};

// ===================== Override _render ===================
const originalRender = DisplayObject.prototype._render;
DisplayObject.prototype._render = function(ctx) {
    if (!this.visible) return;
    ctx.save();
    ctx.globalAlpha *= this.alpha;

    this._applyTransform(ctx);
    this._applyBlendMode(ctx);
    this._applyFilters(ctx);

    if (this.mask) {
        ctx.save();
        this.mask._render(ctx);
        ctx.clip();
    }

    if (this.graphics) this.graphics._draw(ctx);

    for (let child of this.children) {
        child._render(ctx);
    }

    if (this.mask) ctx.restore();

    ctx.restore();
};

/*==================================================
  END OF Display(4).js
==================================================*/