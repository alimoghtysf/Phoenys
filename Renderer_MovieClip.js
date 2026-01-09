/*==================================================
  Renderer_MovieClip.js
  Draw MovieClips: frames, children, hierarchy
==================================================*/

import { RendererTransform } from "./Renderer_Transform.js";
import { RendererPrimitives } from "./Renderer_Primitives.js";

export class RendererMovieClip {
    constructor() {
        this.transform = new RendererTransform();
        this.primitives = new RendererPrimitives();
    }

    // ================= Draw MovieClip =================
    draw(ctx, movieClip) {
        if(!movieClip.visible) return;

        // ================= Apply Transform =================
        this.transform.applyTransform(ctx, movieClip);

        // ================= Draw Current Frame =================
        if(movieClip.frames && movieClip.currentFrame !== undefined) {
            const frameObj = movieClip.frames[movieClip.currentFrame];
            if(frameObj.shapes) this.primitives.drawShapes(ctx, frameObj.shapes);
        }

        // ================= Draw Children =================
        if(movieClip.children) {
            for(let child of movieClip.children) {
                if(child.draw) child.draw(ctx); // كل child مسؤول عن draw() الخاص فيه
            }
        }

        // ================= Restore Transform =================
        this.transform.restoreTransform(ctx);
    }

    // ================= Advance Frame =================
    nextFrame(movieClip) {
        if(!movieClip.frames) return;
        movieClip.currentFrame = (movieClip.currentFrame + 1) % movieClip.frames.length;
    }

    prevFrame(movieClip) {
        if(!movieClip.frames) return;
        movieClip.currentFrame = (movieClip.currentFrame - 1 + movieClip.frames.length) % movieClip.frames.length;
    }

    gotoFrame(movieClip, frameNumber) {
        if(!movieClip.frames) return;
        movieClip.currentFrame = frameNumber % movieClip.frames.length;
    }
}

/*==================================================
  END OF Renderer_MovieClip.js
==================================================*/