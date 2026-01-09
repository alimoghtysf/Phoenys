/*==================================================
  Renderer_Transform.js
  Handles Transformations: translation, rotation, scale, alpha
==================================================*/

export class RendererTransform {
    constructor() {}

    // ================= Apply Transform =================
    applyTransform(ctx, obj) {
        ctx.save(); // حفظ حالة الـ canvas قبل التحويل

        // ================= Alpha =================
        ctx.globalAlpha *= obj.alpha !== undefined ? obj.alpha : 1.0;

        // ================= Translation =================
        ctx.translate(obj.x || 0, obj.y || 0);

        // ================= Rotation =================
        if(obj.rotation) ctx.rotate((obj.rotation * Math.PI) / 180);

        // ================= Scale =================
        ctx.scale(obj.scaleX || 1, obj.scaleY || 1);
    }

    // ================= Restore Transform =================
    restoreTransform(ctx) {
        ctx.restore(); // استرجاع حالة الـ canvas السابقة
    }

    // ================= Apply + Draw Callback =================
    drawWithTransform(ctx, obj, drawCallback) {
        this.applyTransform(ctx, obj);
        if(typeof drawCallback === "function") drawCallback();
        this.restoreTransform(ctx);
    }
}

/*==================================================
  END OF Renderer_Transform.js
==================================================*/