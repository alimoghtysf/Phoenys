/*==================================================
  Filters.js
  Full AS3 Filters & Bitmap Effects
==================================================*/

export class ColorTransform {
    constructor(redMultiplier=1, greenMultiplier=1, blueMultiplier=1, alphaMultiplier=1, redOffset=0, greenOffset=0, blueOffset=0, alphaOffset=0){
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

export class GlowFilter {
    constructor(color="#FFFFFF", alpha=1, blurX=6, blurY=6, strength=2, quality=1, inner=false, knockout=false){
        this.color = color;
        this.alpha = alpha;
        this.blurX = blurX;
        this.blurY = blurY;
        this.strength = strength;
        this.quality = quality;
        this.inner = inner;
        this.knockout = knockout;
    }

    apply(ctx, x, y, width, height){
        ctx.save();
        ctx.shadowColor = this.color;
        ctx.shadowBlur = (this.blurX + this.blurY)/2;
        ctx.globalAlpha = this.alpha;
        // shadow applied automatically on drawing
        ctx.restore();
    }
}

export class BlurFilter {
    constructor(blurX=4, blurY=4, quality=1){
        this.blurX = blurX;
        this.blurY = blurY;
        this.quality = quality;
    }

    apply(ctx){
        // basic approximation using canvas filter
        ctx.save();
        ctx.filter = `blur(${(this.blurX+this.blurY)/2}px)`;
        ctx.restore();
    }
}

export class DropShadowFilter extends GlowFilter {
    constructor(color="#000000", alpha=1, blurX=4, blurY=4, distance=4, angle=45, strength=1, quality=1, inner=false, knockout=false){
        super(color, alpha, blurX, blurY, strength, quality, inner, knockout);
        this.distance = distance;
        this.angle = angle;
    }

    apply(ctx, x, y, width, height){
        ctx.save();
        const rad = this.angle * Math.PI / 180;
        ctx.shadowOffsetX = Math.cos(rad) * this.distance;
        ctx.shadowOffsetY = Math.sin(rad) * this.distance;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = (this.blurX + this.blurY)/2;
        ctx.globalAlpha = this.alpha;
        ctx.restore();
    }
}