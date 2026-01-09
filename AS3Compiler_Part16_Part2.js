/*==================================================
  AS3Compiler_Part16_Part2.js
  Advanced Filters for BitmapData - Full Flash Effects
==================================================*/

import {BitmapData} from './AS3Compiler_Part16.js';

// ===================== Blur Filter ===================
export function blurFilter(pixels, width, height, radius=2){
    // تبسيط Gaussian Blur
    const tmp = new Uint8ClampedArray(pixels);
    for(let y=0;y<height;y++){
        for(let x=0;x<width;x++){
            let r=0,g=0,b=0,count=0;
            for(let dy=-radius;dy<=radius;dy++){
                for(let dx=-radius;dx<=radius;dx++){
                    const nx = x+dx;
                    const ny = y+dy;
                    if(nx>=0 && ny>=0 && nx<width && ny<height){
                        const idx = (ny*width+nx)*4;
                        r += tmp[idx];
                        g += tmp[idx+1];
                        b += tmp[idx+2];
                        count++;
                    }
                }
            }
            const idx = (y*width+x)*4;
            pixels[idx] = r/count;
            pixels[idx+1] = g/count;
            pixels[idx+2] = b/count;
        }
    }
}

// ===================== Brightness / Contrast ===================
export function brightnessFilter(pixels, value=0){
    for(let i=0;i<pixels.length;i+=4){
        pixels[i] += value;
        pixels[i+1] += value;
        pixels[i+2] += value;
    }
}

export function contrastFilter(pixels, factor=1){
    const intercept = 128*(1-factor);
    for(let i=0;i<pixels.length;i+=4){
        pixels[i] = pixels[i]*factor + intercept;
        pixels[i+1] = pixels[i+1]*factor + intercept;
        pixels[i+2] = pixels[i+2]*factor + intercept;
    }
}

// ===================== Sepia ===================
export function sepiaFilter(pixels){
    for(let i=0;i<pixels.length;i+=4){
        const r = pixels[i], g = pixels[i+1], b = pixels[i+2];
        pixels[i]   = Math.min(0.393*r + 0.769*g + 0.189*b,255);
        pixels[i+1] = Math.min(0.349*r + 0.686*g + 0.168*b,255);
        pixels[i+2] = Math.min(0.272*r + 0.534*g + 0.131*b,255);
    }
}

// ===================== Invert + Grayscale (Extended) ===================
export function invertFilter(pixels){
    for(let i=0;i<pixels.length;i+=4){
        pixels[i] = 255-pixels[i];
        pixels[i+1] = 255-pixels[i+1];
        pixels[i+2] = 255-pixels[i+2];
    }
}

export function grayscaleFilter(pixels){
    for(let i=0;i<pixels.length;i+=4){
        const avg = (pixels[i]+pixels[i+1]+pixels[i+2])/3;
        pixels[i] = pixels[i+1] = pixels[i+2] = avg;
    }
}

// ===================== Alpha / Opacity ===================
export function alphaFilter(pixels, alpha=1){
    for(let i=0;i<pixels.length;i+=4){
        pixels[i+3] = pixels[i+3]*alpha;
    }
}

// ===================== Threshold ===================
export function thresholdFilter(pixels, threshold=128){
    for(let i=0;i<pixels.length;i+=4){
        const lum = 0.2126*pixels[i]+0.7152*pixels[i+1]+0.0722*pixels[i+2];
        const val = lum>=threshold?255:0;
        pixels[i] = pixels[i+1] = pixels[i+2] = val;
    }
}

// ===================== Colorize ===================
export function colorizeFilter(pixels, rFactor=1,gFactor=1,bFactor=1){
    for(let i=0;i<pixels.length;i+=4){
        pixels[i] *= rFactor;
        pixels[i+1] *= gFactor;
        pixels[i+2] *= bFactor;
    }
}

/*==================================================
  END OF AS3Compiler_Part16_Part2.js
==================================================*/