/*==================================================
  AS3Compiler_Part10.js
  Bitmap + BitmapData + Pixel Manipulation + Filters - Part 10
==================================================*/

import {DisplayObject} from './Display(1).js'; // افتراض وجود DisplayObject أساسي

export class BitmapData {
    constructor(width, height, transparent=true, fillColor=0x00000000){
        this.width = width;
        this.height = height;
        this.transparent = transparent;
        this.data = new Uint32Array(width * height).fill(fillColor); // ARGB
    }

    getPixel(x, y){
        if(x < 0 || x >= this.width || y < 0 || y >= this.height) return 0;
        return this.data[y * this.width + x] & 0xFFFFFF;
    }

    getPixel32(x, y){
        if(x < 0 || x >= this.width || y < 0 || y >= this.height) return 0;
        return this.data[y * this.width + x];
    }

    setPixel(x, y, color){
        if(x < 0 || x >= this.width || y < 0 || y >= this.height) return;
        this.data[y * this.width + x] = 0xFF000000 | (color & 0xFFFFFF);
    }

    setPixel32(x, y, color){
        if(x < 0 || x >= this.width || y < 0 || y >= this.height) return;
        this.data[y * this.width + x] = color;
    }

    applyFilter(filterFunc){
        for(let i = 0; i < this.data.length; i++){
            this.data[i] = filterFunc(this.data[i]);
        }
    }
}

export class Bitmap extends DisplayObject {
    constructor(bitmapData=null){
        super();
        this.bitmapData = bitmapData;
    }

    setBitmapData(bitmapData){
        this.bitmapData = bitmapData;
    }

    draw(ctx){
        if(!this.bitmapData || !ctx) return;
        const imageData = ctx.createImageData(this.bitmapData.width, this.bitmapData.height);
        const data = imageData.data;
        for(let i = 0; i < this.bitmapData.data.length; i++){
            const argb = this.bitmapData.data[i];
            const idx = i * 4;
            data[idx] = (argb >> 16) & 0xFF; // R
            data[idx+1] = (argb >> 8) & 0xFF; // G
            data[idx+2] = argb & 0xFF; // B
            data[idx+3] = (argb >> 24) & 0xFF; // A
        }
        ctx.putImageData(imageData, this.x, this.y);
    }
}

/*==================================================
  END OF AS3Compiler_Part10.js
==================================================*/