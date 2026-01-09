/*==================================================
  AS3Compiler_Part9.js
  MovieClip + Timeline + Frames + Animation Control - Part 9
==================================================*/

import {EventDispatcher, Event} from './AS3Compiler_Part7.js';
import {DisplayObject} from './Display(1).js'; // افتراض وجود DisplayObject أساسي

export class Frame {
    constructor(actions=[], duration=1){
        this.actions = actions; // Array of functions to execute
        this.duration = duration; // frames count
    }
}

export class Timeline {
    constructor(){
        this.frames = [];
        this.currentFrameIndex = 0;
        this.loop = true;
        this.playing = false;
        this.frameCounter = 0;
    }

    addFrame(frame){
        this.frames.push(frame);
    }

    gotoFrame(index){
        if(index < 0 || index >= this.frames.length) return;
        this.currentFrameIndex = index;
        this.frameCounter = 0;
        this.executeFrame();
    }

    executeFrame(){
        const frame = this.frames[this.currentFrameIndex];
        if(!frame) return;
        for(const action of frame.actions){
            action();
        }
    }

    nextFrame(){
        this.currentFrameIndex++;
        if(this.currentFrameIndex >= this.frames.length){
            if(this.loop) this.currentFrameIndex = 0;
            else this.currentFrameIndex = this.frames.length - 1;
        }
        this.frameCounter = 0;
        this.executeFrame();
    }

    play(){
        this.playing = true;
    }

    stop(){
        this.playing = false;
    }

    update(){
        if(!this.playing) return;
        this.frameCounter++;
        const frame = this.frames[this.currentFrameIndex];
        if(frame && this.frameCounter >= frame.duration){
            this.nextFrame();
        }
    }
}

export class MovieClip extends DisplayObject {
    constructor(){
        super();
        this.timeline = new Timeline();
    }

    addFrame(actions=[], duration=1){
        const frame = new Frame(actions, duration);
        this.timeline.addFrame(frame);
    }

    gotoAndPlay(index){
        this.timeline.gotoFrame(index);
        this.timeline.play();
    }

    gotoAndStop(index){
        this.timeline.gotoFrame(index);
        this.timeline.stop();
    }

    play(){
        this.timeline.play();
    }

    stop(){
        this.timeline.stop();
    }

    update(){
        this.timeline.update();
    }
}

/*==================================================
  END OF AS3Compiler_Part9.js
==================================================*/