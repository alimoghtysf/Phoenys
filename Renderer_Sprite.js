/*==================================================
  Renderer_Sprite.js
  Draw Sprites and link them with MovieClips
==================================================*/

import { RendererTransform } from "./Renderer_Transform.js";
import { RendererPrimitives } from "./Renderer_Primitives.js";

export class RendererSprite {
    constructor() {
        this.transform = new RendererTransform();
        this.primitives = new RendererPrimitives();
    }

    draw(ctx, sprite) {
        if(!sprite.visible) return;

        // ================= Apply Transform =================
        this.transform.applyTransform(ctx, sprite);

        // ================= Draw Graphics =================
        if(sprite.graphics) {
            this.primitives.drawShapes(ctx, sprite.graphics);
        }

        // ================= Draw Children =================
        if(sprite.children) {
            for(let child of sprite.children) {
                if(child.draw) child.draw(ctx); // كل child يرسم نفسه
            }
        }

        // ================= Restore Transform =================
        this.transform.restoreTransform(ctx);
    }

    addChild(sprite, child) {
        if(!sprite.children) sprite.children = [];
        sprite.children.push(child);
    }

    removeChild(sprite, child) {
        if(!sprite.children) return;
        const index = sprite.children.indexOf(child);
        if(index >= 0) sprite.children.splice(index, 1);
    }
}

/*==================================================
  END OF Renderer_Sprite.js
==================================================*/