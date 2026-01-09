/*==================================================
  Renderer_Filters.js
  Apply Filters: blur, dropShadow, glow, colorMatrix
==================================================*/

export class RendererFilters {
    constructor() {}

    // ================= Apply Blur =================
    applyBlur(ctx, obj) {
        if(!obj.filters) return;
        for(let f of obj.filters) {
            if(f.type === "blur") {
                ctx.filter = `blur(${f.value || 5}px)`;
            }
        }
    }

    // ================= Apply DropShadow =================
    applyDropShadow(ctx, obj) {
        if(!obj.filters) return;
        for(let f of obj.filters) {
            if(f.type === "dropShadow") {
                ctx.shadowColor = f.color || "#000";
                ctx.shadowBlur = f.blur || 5;
                ctx.shadowOffsetX = f.offsetX || 5;
                ctx.shadowOffsetY = f.offsetY || 5;
            }
        }
    }

    // ================= Apply Glow =================
    applyGlow(ctx, obj) {
        if(!obj.filters) return;
        for(let f of obj.filters) {
            if(f.type === "glow") {
                ctx.shadowColor = f.color || "#fff";
                ctx.shadowBlur = f.blur || 10;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
            }
        }
    }

    // ================= Apply All Filters =================
    applyFilters(ctx, obj) {
        ctx.filter = "none";
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        this.applyBlur(ctx, obj);
        this.applyDropShadow(ctx, obj);
        this.applyGlow(ctx, obj);
        // لاحقًا يمكن إضافة colorMatrix, tint, gradient maps
    }

    // ================= Reset Filters =================
    reset(ctx) {
        ctx.filter = "none";
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    }
}

/*==================================================
  END OF Renderer_Filters.js
==================================================*/