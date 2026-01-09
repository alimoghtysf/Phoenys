/*==================================================
  AS3Compiler_Part16.js
  Bitmap + BitmapData + Pixel Manipulation + Filters - Part 16
==================================================*/

import {DisplayObject} from './Display(1).js';

export class BitmapData {
    constructor(width, height, transparent=true, fillColor=0x000000){
        this.width = width;
        this.height = height;
        this.transparent = transparent;
        this.fillColor = fillColor;
        this.canvas = document.createElement("canvas");
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.canvas.getContext("2d");
        this.ctx.fillStyle = `#${fillColor.toString(16).padStart(6,"0")}`;
        this.ctx.fillRect(0,0,width,height);
    }

    setPixel(x,y,color){
        const r = (color>>16)&0xFF;
        const g = (color>>8)&0xFF;
        const b = color&0xFF;
        this.ctx.fillStyle = `rgb(${r},${g},${b})`;
        this.ctx.fillRect(x,y,1,1);
    }

    getPixel(x,y){
        const data = this.ctx.getImageData(x,y,1,1).data;
        return (data[0]<<16) | (data[1]<<8) | data[2];
    }

    applyFilter(filterFunc){
        const imageData = this.ctx.getImageData(0,0,this.width,this.height);
        filterFunc(imageData.data);
        this.ctx.putImageData(imageData,0,0);
    }
}

export class Bitmap extends DisplayObject {
    constructor(bitmapData){
        super();
        this.bitmapData = bitmapData;
    }

    draw(ctx){
        if(!ctx || !this.bitmapData) return;
        ctx.drawImage(this.bitmapData.canvas, this.x, this.y);
    }
}

// ===================== Example Filters ===================
export function invertFilter(pixels){
    for(let i=0;i<pixels.length;i+=4){
        pixels[i] = 255 - pixels[i];     // R
        pixels[i+1] = 255 - pixels[i+1]; // G
        pixels[i+2] = 255 - pixels[i+2]; // B
    }
}

export function grayscaleFilter(pixels){
    for(let i=0;i<pixels.length;i+=4){
        const avg = (pixels[i]+pixels[i+1]+pixels[i+2])/3;
        pixels[i] = pixels[i+1] = pixels[i+2] = avg;
    }
}

/*==================================================
  END OF AS3Compiler_Part16.js
==================================================*/