/*==================================================
  AS3Compiler_Part14.js
  MovieClip + Timeline + Frames + Labels + Control Methods - Part 14
==================================================*/

import {DisplayObject} from './Display(1).js';
import {EventDispatcher, Event} from './EventDispatcher.js';

export class Frame {
    constructor(content=[], label=null){
        this.content = content; // مصفوفة DisplayObjects
        this.label = label;
    }
}

export class Timeline extends EventDispatcher {
    constructor() {
        super();
        this.frames = [];
        this.currentFrame = 0;
        this.playing = true;
    }

    addFrame(frame){
        this.frames.push(frame);
    }

    gotoAndPlay(frameNumberOrLabel){
        const index = this._getFrameIndex(frameNumberOrLabel);
        if(index !== -1){
            this.currentFrame = index;
            this.playing = true;
            this.dispatchEvent(new Event("enterFrame"));
        }
    }

    gotoAndStop(frameNumberOrLabel){
        const index = this._getFrameIndex(frameNumberOrLabel);
        if(index !== -1){
            this.currentFrame = index;
            this.playing = false;
            this.dispatchEvent(new Event("enterFrame"));
        }
    }

    stop(){
        this.playing = false;
    }

    play(){
        this.playing = true;
    }

    nextFrame(){
        if(this.currentFrame < this.frames.length -1){
            this.currentFrame++;
            this.dispatchEvent(new Event("enterFrame"));
        } else {
            this.currentFrame = 0; // loop
        }
    }

    prevFrame(){
        if(this.currentFrame > 0){
            this.currentFrame--;
            this.dispatchEvent(new Event("enterFrame"));
        }
    }

    _getFrameIndex(frameNumberOrLabel){
        if(typeof frameNumberOrLabel === "number"){
            return frameNumberOrLabel -1;
        } else if(typeof frameNumberOrLabel === "string"){
            for(let i=0;i<this.frames.length;i++){
                if(this.frames[i].label === frameNumberOrLabel) return i;
            }
        }
        return -1;
    }

    get currentContent(){
        return this.frames[this.currentFrame] ? this.frames[this.currentFrame].content : [];
    }
}

export class MovieClip extends DisplayObject {
    constructor(){
        super();
        this.timeline = new Timeline();
    }

    addFrame(frame){
        this.timeline.addFrame(frame);
    }

    gotoAndPlay(frame){
        this.timeline.gotoAndPlay(frame);
    }

    gotoAndStop(frame){
        this.timeline.gotoAndStop(frame);
    }

    stop(){
        this.timeline.stop();
    }

    play(){
        this.timeline.play();
    }

    nextFrame(){
        this.timeline.nextFrame();
    }

    prevFrame(){
        this.timeline.prevFrame();
    }

    draw(ctx){
        if(!ctx) return;
        const contents = this.timeline.currentContent;
        for(let obj of contents){
            if(obj.draw) obj.draw(ctx);
        }
    }
}

/*==================================================
  END OF AS3Compiler_Part14.js
==================================================*/