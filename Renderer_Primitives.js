/*==================================================
  Renderer_Primitives.js
  Draw Basic Shapes: rect, circle, line
==================================================*/

export class RendererPrimitives {
    constructor() {}

    // ================= Draw Rectangle =================
    drawRect(ctx, rect) {
        ctx.fillStyle = rect.fill || "#000";
        ctx.strokeStyle = rect.stroke || "#000";
        ctx.lineWidth = rect.lineWidth || 1;
        ctx.fillRect(rect.x || 0, rect.y || 0, rect.width || 0, rect.height || 0);
        if(rect.stroke) ctx.strokeRect(rect.x || 0, rect.y || 0, rect.width || 0, rect.height || 0);
    }

    // ================= Draw Circle =================
    drawCircle(ctx, circle) {
        ctx.beginPath();
        ctx.arc(circle.x || 0, circle.y || 0, circle.radius || 0, 0, Math.PI * 2);
        ctx.fillStyle = circle.fill || "#000";
        ctx.fill();
        if(circle.stroke) {
            ctx.strokeStyle = circle.stroke;
            ctx.lineWidth = circle.lineWidth || 1;
            ctx.stroke();
        }
    }

    // ================= Draw Line =================
    drawLine(ctx, line) {
        ctx.beginPath();
        ctx.moveTo(line.x1 || 0, line.y1 || 0);
        ctx.lineTo(line.x2 || 0, line.y2 || 0);
        ctx.strokeStyle = line.stroke || "#000";
        ctx.lineWidth = line.lineWidth || 1;
        ctx.stroke();
    }

    // ================= Draw Multiple Shapes =================
    drawShapes(ctx, shapes=[]) {
        for(let shape of shapes) {
            switch(shape.type) {
                case "rect": this.drawRect(ctx, shape); break;
                case "circle": this.drawCircle(ctx, shape); break;
                case "line": this.drawLine(ctx, shape); break;
                // لاحقًا نضيف polygon, curve, gradient...
            }
        }
    }
}

/*==================================================
  END OF Renderer_Primitives.js
==================================================*/