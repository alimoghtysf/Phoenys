/*==================================================
  Renderer_Masks.js
  Clip Masks and Shape Masking System
==================================================*/

export class RendererMasks {
    constructor() {}

    // ================= Apply Mask =================
    applyMask(ctx, obj) {
        if(!obj.mask) return;

        ctx.save();

        // نبدأ المسار
        ctx.beginPath();
        const mask = obj.mask;
        switch(mask.type) {
            case "rect":
                ctx.rect(mask.x || 0, mask.y || 0, mask.width || 0, mask.height || 0);
                break;
            case "circle":
                ctx.arc(mask.x || 0, mask.y || 0, mask.radius || 0, 0, Math.PI * 2);
                break;
            case "custom":
                if(mask.path && typeof mask.path === "function") mask.path(ctx);
                break;
        }

        ctx.clip(); // تطبيق الـ mask
    }

    // ================= Draw With Mask =================
    drawWithMask(ctx, obj, drawCallback) {
        if(!obj.mask) {
            if(typeof drawCallback === "function") drawCallback();
            return;
        }

        ctx.save();
        this.applyMask(ctx, obj);
        if(typeof drawCallback === "function") drawCallback();
        ctx.restore();
    }
}

/*==================================================
  END OF Renderer_Masks.js
==================================================*/