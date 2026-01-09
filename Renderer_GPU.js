/*==================================================
  Renderer_GPU.js
  GPU Accelerated Rendering for AS3 MovieClips
==================================================*/

import {MovieClip} from './MovieClip_Timeline.js';

export class GPURenderer {
    constructor(canvas, stage) {
        this.canvas = canvas;
        this.stage = stage;

        this.gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
        if(!this.gl) {
            console.warn("WebGL not supported, falling back to 2D context.");
            this.ctx = canvas.getContext("2d");
            this.use2D = true;
        } else {
            this.use2D = false;
            this.initGL();
        }
    }

    initGL() {
        const gl = this.gl;
        gl.clearColor(0.8, 0.8, 0.8, 1.0);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        // إعداد Shaders، Buffers، Textures (مبدئي)
        this.vertexBuffer = gl.createBuffer();
        this.textureBuffer = gl.createBuffer();
        this.shaderProgram = this.createDefaultShader();
    }

    createDefaultShader() {
        const gl = this.gl;
        const vsSource = `
            attribute vec2 aPosition;
            attribute vec2 aTexCoord;
            varying vec2 vTexCoord;
            void main() {
                gl_Position = vec4(aPosition, 0.0, 1.0);
                vTexCoord = aTexCoord;
            }
        `;
        const fsSource = `
            precision mediump float;
            uniform sampler2D uSampler;
            varying vec2 vTexCoord;
            void main() {
                gl_FragColor = texture2D(uSampler, vTexCoord);
            }
        `;

        const vertShader = this.compileShader(gl.VERTEX_SHADER, vsSource);
        const fragShader = this.compileShader(gl.FRAGMENT_SHADER, fsSource);

        const program = gl.createProgram();
        gl.attachShader(program, vertShader);
        gl.attachShader(program, fragShader);
        gl.linkProgram(program);
        if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error("Unable to initialize shader program");
        }
        gl.useProgram(program);
        return program;
    }

    compileShader(type, source) {
        const gl = this.gl;
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        }
        return shader;
    }

    renderFrame() {
        if(this.use2D) {
            const ctx = this.ctx;
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.stage.children.forEach(mc => mc.draw(ctx));
        } else {
            const gl = this.gl;
            gl.clear(gl.COLOR_BUFFER_BIT);
            // رسم MovieClips باستخدام WebGL (مبدئي)
            this.stage.children.forEach(mc => mc.drawGL(gl));
        }
    }
}

// ===================== MovieClip GL Extension =====================
MovieClip.prototype.drawGL = function(gl) {
    // هذه دالة مبدئية، يمكن تطويرها لاحقاً لرسم Bitmaps وText باستخدام GPU
    // حاليًا نرسم كمستطيلات بسيطة لكل MovieClip
    const x = (this.x / this.stage.width) * 2 - 1;
    const y = (this.y / this.stage.height) * 2 - 1;
    const w = (this.width / this.stage.width) * 2;
    const h = (this.height / this.stage.height) * 2;
    // هنا يمكن ربط Texture Bitmap للـ WebGL
};

/*==================================================
  END OF Renderer_GPU.js
==================================================*/