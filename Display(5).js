/*==================================================
  Display(5).js
  Display core for AS3 full support (PART 5)
==================================================*/

import { Graphics, DisplayObject } from "./Display(1).js";

// ===================== Vector Shapes ===================
Graphics.prototype.drawPolygon = function(points) {
    if (points.length < 2) return;
    this.commands.push({ type: "polygon", points });
};

Graphics.prototype.drawEllipse = function(x, y, width, height) {
    this.commands.push({ type: "ellipse", x, y, width, height });
};

// ===================== Morphing Shapes ===================
Graphics.prototype.beginMorph = function(targetGraphics, ratio=0) {
    // ratio: 0 = start, 1 = end
    this.commands.push({ type: "morph", target: targetGraphics, ratio });
};

Graphics.prototype._draw = function(ctx) {
    if (this.commands.length === 0) return;
    ctx.beginPath();
    for (let cmd of this.commands) {
        switch(cmd.type) {
            case "moveTo": ctx.moveTo(cmd.x, cmd.y); break;
            case "lineTo": ctx.lineTo(cmd.x, cmd.y); break;
            case "rect": ctx.rect(cmd.x, cmd.y, cmd.width, cmd.height); break;
            case "circle": ctx.arc(cmd.x, cmd.y, cmd.radius, 0, Math.PI*2); break;
            case "ellipse":
                ctx.save();
                ctx.translate(cmd.x, cmd.y);
                ctx.scale(cmd.width/2, cmd.height/2);
                ctx.arc(0, 0, 1, 0, Math.PI*2);
                ctx.restore();
                break;
            case "polygon":
                const pts = cmd.points;
                ctx.moveTo(pts[0].x, pts[0].y);
                for (let i=1; i<pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
                ctx.closePath();
                break;
            case "morph":
                const start = this.commands;
                const end = cmd.target.commands;
                for (let i=0; i<Math.min(start.length,end.length); i++) {
                    const s = start[i];
                    const e = end[i];
                    if (s.x !== undefined && e.x !== undefined && s.y !== undefined && e.y !== undefined) {
                        const x = s.x + (e.x - s.x)*cmd.ratio;
                        const y = s.y + (e.y - s.y)*cmd.ratio;
                        ctx.lineTo(x, y);
                    }
                }
                break;
        }
    }
    if (this.fillStyle) ctx.fillStyle = this.fillStyle, ctx.fill();
    if (this.strokeStyle) ctx.strokeStyle = this.strokeStyle, ctx.lineWidth = this.lineWidth, ctx.stroke();
};

// ===================== Advanced DisplayObject ===================
DisplayObject.prototype.hitTestPoint = function(x, y) {
    // basic bounding box check
    return (x >= this.x && x <= this.x + this.width &&
            y >= this.y && y <= this.y + this.height);
};

DisplayObject.prototype.hitTestObject = function(obj) {
    return !(obj.x > this.x + this.width ||
             obj.x + obj.width < this.x ||
             obj.y > this.y + this.height ||
             obj.y + obj.height < this.y);
};

/*==================================================
  END OF Display(5).js
==================================================*/