/*==================================================
  TimelineManager.js
  Controls all MovieClips on Stage
==================================================*/

export class TimelineManager {
    constructor(){
        this.movieClips = [];
    }

    addMovieClip(mc){
        this.movieClips.push(mc);
    }

    removeMovieClip(mc){
        const index = this.movieClips.indexOf(mc);
        if(index >= 0) this.movieClips.splice(index,1);
    }

    update(deltaTime){
        for(let mc of this.movieClips){
            mc.update(deltaTime);
        }
    }
}