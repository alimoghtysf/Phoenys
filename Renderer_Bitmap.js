/*==================================================
  Renderer_Bitmap.js
  Draw Bitmaps / Images - Supports BitmapData
==================================================*/

import { RendererTransform } from "./Renderer_Transform.js";

export class RendererBitmap {
    constructor() {
        this.transform = new RendererTransform();
        this.cache = new Map(); // Cache images for performance
    }

    // ================= Load Image =================
    loadBitmap(src, callback) {
        if(this.cache.has(src)) {
            callback(this.cache.get(src));
            return;
        }

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            this.cache.set(src, img);
            callback(img);
        };
        img.src = src;
    }

    // ================= Draw Bitmap =================
    draw(ctx, bitmap) {
        if(!bitmap.visible || !bitmap.src) return;

        this.transform.applyTransform(ctx, bitmap);

        const drawImage = (img) => {
            const w = bitmap.width || img.width;
            const h = bitmap.height || img.height;
            ctx.globalAlpha *= bitmap.alpha !== undefined ? bitmap.alpha : 1.0;
            ctx.drawImage(img, bitmap.x || 0, bitmap.y || 0, w, h);
        };

        if(this.cache.has(bitmap.src)) drawImage(this.cache.get(bitmap.src));
        else this.loadBitmap(bitmap.src, drawImage);

        this.transform.restoreTransform(ctx);
    }
}

/*==================================================
  END OF Renderer_Bitmap.js
==================================================*/