/*==================================================
  AssetsIntegration.js
  TextFields, Fonts, Bitmaps, Sound Integration for AS3
==================================================*/

import {MovieClip} from './MovieClip_Timeline.js';
import {AudioSystem, Sound} from './AudioSystem.js';

export class BitmapObject {
    constructor(imageSrc) {
        this.img = new Image();
        this.img.src = imageSrc;
        this.width = 0;
        this.height = 0;
        this.loaded = false;
        this.img.onload = () => {
            this.width = this.img.width;
            this.height = this.img.height;
            this.loaded = true;
        };
    }

    draw(ctx, x, y) {
        if(this.loaded) ctx.drawImage(this.img, x, y);
    }
}

export class TextField {
    constructor(text = "", font="Arial", size=16, color="#000000") {
        this.text = text;
        this.font = font;
        this.size = size;
        this.color = color;
        this.width = 0;
        this.height = 0;
    }

    draw(ctx, x, y) {
        ctx.save();
        ctx.font = `${this.size}px ${this.font}`;
        ctx.fillStyle = this.color;
        ctx.textBaseline = "top";
        ctx.fillText(this.text, x, y);
        const metrics = ctx.measureText(this.text);
        this.width = metrics.width;
        this.height = this.size;
        ctx.restore();
    }
}

export class SoundObject {
    constructor(src) {
        this.sound = new Sound(src);
        this.channel = null;
    }

    play(loop = false) {
        this.sound.loop = loop;
        this.channel = this.sound.play();
    }

    stop() {
        if(this.channel) this.channel.stop();
    }

    setVolume(vol) {
        this.sound.setVolume(vol);
    }
}

// ===================== MovieClip Extensions =====================
MovieClip.prototype.addBitmap = function(imageSrc) {
    const bmp = new BitmapObject(imageSrc);
    this.addFrame("frame_bmp", 1, ()=>{
        const ctx = this.stage.ctx;
        bmp.draw(ctx, this.x, this.y);
    });
    return bmp;
};

MovieClip.prototype.addTextField = function(text, font="Arial", size=16, color="#000000") {
    const tf = new TextField(text, font, size, color);
    this.addFrame("frame_text", 1, ()=>{
        const ctx = this.stage.ctx;
        tf.draw(ctx, this.x, this.y);
    });
    return tf;
};

MovieClip.prototype.addSound = function(src) {
    const snd = new SoundObject(src);
    this.addFrame("frame_sound", 1, ()=>{
        snd.play();
    });
    return snd;
};

/*==================================================
  END OF AssetsIntegration.js
==================================================*/