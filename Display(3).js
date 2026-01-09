/*==================================================
  Display(3).js
  Display core for AS3 full support (PART 3)
==================================================*/

import { DisplayObject, Sprite, Graphics, MovieClip } from "./Display(1).js";

// ======================= Filters =========================
export class ColorTransform {
    constructor(redMultiplier=1, greenMultiplier=1, blueMultiplier=1, alphaMultiplier=1,
                redOffset=0, greenOffset=0, blueOffset=0, alphaOffset=0) {
        this.redMultiplier = redMultiplier;
        this.greenMultiplier = greenMultiplier;
        this.blueMultiplier = blueMultiplier;
        this.alphaMultiplier = alphaMultiplier;
        this.redOffset = redOffset;
        this.greenOffset = greenOffset;
        this.blueOffset = blueOffset;
        this.alphaOffset = alphaOffset;
    }
}

export class BlurFilter {
    constructor(blurX=0, blurY=0) {
        this.blurX = blurX;
        this.blurY = blurY;
    }
}

export class DropShadowFilter {
    constructor(distance=4, angle=45, color="#000000", alpha=1.0, blurX=4, blurY=4) {
        this.distance = distance;
        this.angle = angle;
        this.color = color;
        this.alpha = alpha;
        this.blurX = blurX;
        this.blurY = blurY;
    }
}

// ===================== Masking =========================
DisplayObject.prototype.applyMask = function(maskObj) {
    this.mask = maskObj;
};

DisplayObject.prototype._render = function(ctx) {
    if (!this.visible) return;
    ctx.save();
    ctx.globalAlpha *= this.alpha;
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.scale(this.scaleX, this.scaleY);

    // Apply mask if exists
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

// ===================== Advanced Graphics ===================
Graphics.prototype.beginGradientFill = function(colors, positions, type="linear") {
    // placeholder for linear/radial gradient fill
    this.commands.push({ type: "gradientFill", colors, positions, gradientType: type });
};

Graphics.prototype.drawCircle = function(x, y, radius) {
    this.commands.push({ type: "circle", x, y, radius });
};

Graphics.prototype.drawRect = function(x, y, width, height) {
    this.commands.push({ type: "rect", x, y, width, height });
};

Graphics.prototype._draw = function(ctx) {
    if (this.commands.length === 0) return;
    ctx.beginPath();
    for (let cmd of this.commands) {
        switch(cmd.type) {
            case "moveTo":
                ctx.moveTo(cmd.x, cmd.y); break;
            case "lineTo":
                ctx.lineTo(cmd.x, cmd.y); break;
            case "rect":
                ctx.rect(cmd.x, cmd.y, cmd.width, cmd.height); break;
            case "circle":
                ctx.arc(cmd.x, cmd.y, cmd.radius, 0, Math.PI*2); break;
            case "gradientFill":
                let grad;
                if (cmd.gradientType === "linear") {
                    grad = ctx.createLinearGradient(0, 0, 100, 100);
                } else {
                    grad = ctx.createRadialGradient(50,50,0,50,50,50);
                }
                cmd.colors.forEach((c, i) => grad.addColorStop(cmd.positions[i], c));
                ctx.fillStyle = grad;
                ctx.fill();
                break;
        }
    }
    if (this.fillStyle && this.commands.some(c=>c.type!=="gradientFill")) {
        ctx.fillStyle = this.fillStyle;
        ctx.fill();
    }
    if (this.strokeStyle) {
        ctx.strokeStyle = this.strokeStyle;
        ctx.lineWidth = this.lineWidth;
        ctx.stroke();
    }
};

/*==================================================
  END OF Display(3).js
==================================================*/