/*==================================================
  AS3Compiler_Part15.js
  Shapes + Vector Graphics + LineStyle + FillStyle + Gradient + Curve - Part 15
==================================================*/

import {DisplayObject} from './Display(1).js';

export class Shape extends DisplayObject {
    constructor(){
        super();
        this.graphics = new Graphics();
    }

    draw(ctx){
        if(!ctx) return;
        this.graphics.render(ctx, this.x, this.y);
    }
}

export class Graphics {
    constructor(){
        this.commands = [];
        this.strokeStyle = "#000000";
        this.fillStyle = null;
    }

    lineStyle(thickness=1, color=0x000000, alpha=1){
        this.strokeStyle = `rgba(${(color>>16)&0xFF},${(color>>8)&0xFF},${color&0xFF},${alpha})`;
        this.commands.push({type:"lineStyle", thickness, color:this.strokeStyle});
    }

    beginFill(color=0x000000, alpha=1){
        this.fillStyle = `rgba(${(color>>16)&0xFF},${(color>>8)&0xFF},${color&0xFF},${alpha})`;
        this.commands.push({type:"beginFill", color:this.fillStyle});
    }

    endFill(){
        this.fillStyle = null;
        this.commands.push({type:"endFill"});
    }

    moveTo(x,y){
        this.commands.push({type:"moveTo", x, y});
    }

    lineTo(x,y){
        this.commands.push({type:"lineTo", x, y});
    }

    curveTo(cx, cy, x, y){
        this.commands.push({type:"curveTo", cx, cy, x, y});
    }

    render(ctx, offsetX=0, offsetY=0){
        ctx.save();
        for(let cmd of this.commands){
            switch(cmd.type){
                case "lineStyle":
                    ctx.lineWidth = cmd.thickness;
                    ctx.strokeStyle = cmd.color;
                    break;
                case "beginFill":
                    ctx.fillStyle = cmd.color;
                    ctx.isFilling = true;
                    break;
                case "endFill":
                    ctx.isFilling = false;
                    break;
                case "moveTo":
                    ctx.beginPath();
                    ctx.moveTo(cmd.x + offsetX, cmd.y + offsetY);
                    break;
                case "lineTo":
                    ctx.lineTo(cmd.x + offsetX, cmd.y + offsetY);
                    if(ctx.isFilling) ctx.fill();
                    ctx.stroke();
                    break;
                case "curveTo":
                    ctx.quadraticCurveTo(cmd.cx + offsetX, cmd.cy + offsetY, cmd.x + offsetX, cmd.y + offsetY);
                    if(ctx.isFilling) ctx.fill();
                    ctx.stroke();
                    break;
            }
        }
        ctx.restore();
    }
}

/*==================================================
  END OF AS3Compiler_Part15.js
==================================================*/