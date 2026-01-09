/*==================================================
  GPURenderer.js
  Uses WebGL for DisplayObjects & MovieClips with basic shader
==================================================*/

export class GPURenderer {
    constructor(canvas){
        this.canvas = canvas;
        this.gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if(!this.gl){
            console.warn("WebGL not supported, falling back to Canvas2D");
            this.gl = null;
            return;
        }

        this.initShaders();
    }

    initShaders(){
        const gl = this.gl;

        // Vertex Shader: يحدد مكان كل ركن
        const vertexSrc = `
            attribute vec2 a_position;
            attribute vec2 a_texCoord;
            varying vec2 v_texCoord;
            void main() {
                gl_Position = vec4(a_position, 0.0, 1.0);
                v_texCoord = a_texCoord;
            }
        `;

        // Fragment Shader: يطبق اللون وشفافية + تأثير أساسي
        const fragmentSrc = `
            precision mediump float;
            uniform sampler2D u_texture;
            varying vec2 v_texCoord;
            void main() {
                vec4 color = texture2D(u_texture, v_texCoord);
                // مثال فلتر: زيادة السطوع
                color.rgb *= 1.1;
                gl_FragColor = color;
            }
        `;

        this.vertexShader = this.createShader(gl.VERTEX_SHADER, vertexSrc);
        this.fragmentShader = this.createShader(gl.FRAGMENT_SHADER, fragmentSrc);

        this.program = this.createProgram(this.vertexShader, this.fragmentShader);
        gl.useProgram(this.program);

        // Attribute & Uniform locations
        this.a_position = gl.getAttribLocation(this.program, "a_position");
        this.a_texCoord = gl.getAttribLocation(this.program, "a_texCoord");
        this.u_texture = gl.getUniformLocation(this.program, "u_texture");

        // Buffer setup
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1, -1,
             1, -1,
            -1,  1,
             1,  1
        ]), gl.STATIC_DRAW);

        this.texCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0, 0,
            1, 0,
            0, 1,
            1, 1
        ]), gl.STATIC_DRAW);
    }

    createShader(type, source){
        const gl = this.gl;
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
            console.error("Shader compile error:", gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    createProgram(vertexShader, fragmentShader){
        const gl = this.gl;
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
            console.error("Program link error:", gl.getProgramInfoLog(program));
            return null;
        }
        return program;
    }

    drawTexture(texture, x=0, y=0, width=1, height=1, blendMode="NORMAL"){
        if(!this.gl){
            const ctx = this.canvas.getContext("2d");
            applyBlendMode(ctx, blendMode);
            ctx.drawImage(texture, x, y, width, height);
            return;
        }

        const gl = this.gl;
        gl.useProgram(this.program);

        // إعداد الـ vertices
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.enableVertexAttribArray(this.a_position);
        gl.vertexAttribPointer(this.a_position, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
        gl.enableVertexAttribArray(this.a_texCoord);
        gl.vertexAttribPointer(this.a_texCoord, 2, gl.FLOAT, false, 0, 0);

        // ربط Texture
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(this.u_texture, 0);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    clear(color=[0,0,0,0]){
        if(this.gl){
            this.gl.clearColor(...color);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        } else {
            const ctx = this.canvas.getContext("2d");
            ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        }
    }
}