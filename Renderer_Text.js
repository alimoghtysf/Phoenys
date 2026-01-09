/*==================================================
  Renderer_Text.js
  Draw TextFields with font, size, color, alignment
==================================================*/

import { RendererTransform } from "./Renderer_Transform.js";

export class RendererText {
    constructor() {
        this.transform = new RendererTransform();
    }

    draw(ctx, textField) {
        if(!textField.visible) return;

        // ================= Apply Transform =================
        this.transform.applyTransform(ctx, textField);

        // ================= Set Font =================
        ctx.font = `${textField.size || 20}px ${textField.font || "Arial"}`;
        ctx.fillStyle = textField.color || "#000";
        ctx.textAlign = textField.align || "left";
        ctx.textBaseline = textField.baseline || "top";

        // ================= Draw Text =================
        ctx.fillText(textField.text || "", textField.x || 0, textField.y || 0);

        // ================= Restore Transform =================
        this.transform.restoreTransform(ctx);
    }
}

/*==================================================
  END OF Renderer_Text.js
==================================================*/