/*==================================================
  Display(8).js
  Display core for AS3 full support (PART 8)
  GPU Accelerated Renderer (WebGL)
==================================================*/

import { DisplayObject } from "./Display(1).js";

export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if(!this.gl) {
            console.warn("WebGL not supported, fallback to 2D Canvas");
            this.ctx = canvas.getContext("2d");
        } else {
            this._initGL();
        }
    }

    _initGL() {
        const gl = this.gl;
        gl.clearColor(0,0,0,0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        // Placeholder: setup shaders, buffers for 2D rendering
        // سيتم توسيعه لاحقًا لدعم SWF كامل
    }

    clear() {
        if(this.gl) {
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        } else if(this.ctx) {
            this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        }
    }

    render(displayObject) {
        if(this.gl) {
            // Placeholder: render with WebGL
            // يمكننا رسم كل DisplayObject مع تحويلاته وفلتراته
        } else if(this.ctx) {
            displayObject._render(this.ctx);
        }
    }
}

// ===================== Stage with GPU ===================
import { Stage as StageBase } from "./Display(1).js";

export class Stage extends StageBase {
    constructor(canvas) {
        super(canvas);
        this.renderer = new Renderer(canvas);
        this._startLoop();
    }

    _startLoop() {
        const loop = (time) => {
            this.renderer.clear();
            this.renderer.render(this);
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }
}

/*==================================================
  END OF Display(8).js
==================================================*/