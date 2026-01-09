/*========================================================
  FilterManager.js
  Flash Player Style Filters - SINGLE FILE FINAL
========================================================*/

class FlashFilter {
    constructor(type) {
        this.type = type;
        this.enabled = true;
    }
}

/* ================== FILTERS ================== */

class BlurFilter extends FlashFilter {
    constructor(blurX=4, blurY=4, quality=1) {
        super("blur");
        this.blurX = blurX;
        this.blurY = blurY;
        this.quality = quality;
    }
}

class GlowFilter extends FlashFilter {
    constructor(color=0xffffff, alpha=1, blurX=6, blurY=6, strength=2, inner=false, knockout=false, quality=1) {
        super("glow");
        this.color = color;
        this.alpha = alpha;
        this.blurX = blurX;
        this.blurY = blurY;
        this.strength = strength;
        this.inner = inner;
        this.knockout = knockout;
        this.quality = quality;
    }
}

class DropShadowFilter extends FlashFilter {
    constructor(distance=4, angle=45, color=0x000000, alpha=1, blurX=4, blurY=4, strength=1, inner=false, knockout=false, quality=1) {
        super("shadow");
        this.distance = distance;
        this.angle = angle * Math.PI / 180;
        this.color = color;
        this.alpha = alpha;
        this.blurX = blurX;
        this.blurY = blurY;
        this.strength = strength;
        this.inner = inner;
        this.knockout = knockout;
        this.quality = quality;
    }
}

class ColorMatrixFilter extends FlashFilter {
    constructor(matrix) {
        super("colormatrix");
        this.matrix = matrix || [
            1,0,0,0,0,
            0,1,0,0,0,
            0,0,1,0,0,
            0,0,0,1,0
        ];
    }
}

class BevelFilter extends FlashFilter {
    constructor(distance=4, angle=45, highlightColor=0xffffff, highlightAlpha=1,
                shadowColor=0x000000, shadowAlpha=1, blurX=4, blurY=4,
                strength=1, quality=1, type="inner", knockout=false) {
        super("bevel");
        this.distance = distance;
        this.angle = angle * Math.PI / 180;
        this.highlightColor = highlightColor;
        this.highlightAlpha = highlightAlpha;
        this.shadowColor = shadowColor;
        this.shadowAlpha = shadowAlpha;
        this.blurX = blurX;
        this.blurY = blurY;
        this.strength = strength;
        this.quality = quality;
        this.bevelType = type;
        this.knockout = knockout;
    }
}

class DisplacementMapFilter extends FlashFilter {
    constructor(map, scaleX=10, scaleY=10) {
        super("displacement");
        this.map = map;
        this.scaleX = scaleX;
        this.scaleY = scaleY;
    }
}

/* ================== MANAGER ================== */

class FilterManager {

    static apply(ctx, image, filters, x, y, w, h) {
        ctx.save();
        ctx.drawImage(image, x, y, w, h);

        for (let f of filters) {
            if (!f.enabled) continue;

            switch (f.type) {

                case "blur":
                    ctx.filter = `blur(${Math.max(f.blurX, f.blurY)}px)`;
                    ctx.drawImage(image, x, y, w, h);
                    ctx.filter = "none";
                    break;

                case "glow":
                    ctx.shadowColor = "#" + f.color.toString(16).padStart(6,"0");
                    ctx.shadowBlur = f.blurX;
                    ctx.globalAlpha = f.alpha;
                    ctx.drawImage(image, x, y, w, h);
                    ctx.globalAlpha = 1;
                    break;

                case "shadow":
                    ctx.shadowColor = "#" + f.color.toString(16).padStart(6,"0");
                    ctx.shadowBlur = f.blurX;
                    ctx.shadowOffsetX = Math.cos(f.angle) * f.distance;
                    ctx.shadowOffsetY = Math.sin(f.angle) * f.distance;
                    ctx.globalAlpha = f.alpha;
                    ctx.drawImage(image, x, y, w, h);
                    ctx.globalAlpha = 1;
                    break;

                case "colormatrix":
                    let imgData = ctx.getImageData(x,y,w,h);
                    let d = imgData.data;
                    let m = f.matrix;
                    for(let i=0;i<d.length;i+=4){
                        let r=d[i], g=d[i+1], b=d[i+2], a=d[i+3];
                        d[i]   = r*m[0]+g*m[1]+b*m[2]+a*m[3]+m[4];
                        d[i+1] = r*m[5]+g*m[6]+b*m[7]+a*m[8]+m[9];
                        d[i+2] = r*m[10]+g*m[11]+b*m[12]+a*m[13]+m[14];
                        d[i+3] = r*m[15]+g*m[16]+b*m[17]+a*m[18]+m[19];
                    }
                    ctx.putImageData(imgData,x,y);
                    break;

                case "bevel":
                    ctx.shadowColor = "#" + f.highlightColor.toString(16).padStart(6,"0");
                    ctx.shadowBlur = f.blurX;
                    ctx.drawImage(image,x,y,w,h);
                    ctx.shadowColor = "#" + f.shadowColor.toString(16).padStart(6,"0");
                    ctx.shadowOffsetX = Math.cos(f.angle)*f.distance;
                    ctx.shadowOffsetY = Math.sin(f.angle)*f.distance;
                    ctx.drawImage(image,x,y,w,h);
                    break;
            }
        }
        ctx.restore();
    }
}

/* ================== EXPORT ================== */

export {
    FilterManager,
    BlurFilter,
    GlowFilter,
    DropShadowFilter,
    ColorMatrixFilter,
    BevelFilter,
    DisplacementMapFilter
};