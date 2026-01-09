/*==================================================
  Renderer_Core.js
  Core Rendering System - Base for Phoenyx Flash Player
==================================================*/

export class RendererCore {
    constructor(canvas) {
        // ================= Canvas Setup =================
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d"); // لاحقاً يمكن WebGL
        this.width = canvas.width;
        this.height = canvas.height;

        // ================= Render Loop =================
        this.root = null; // Stage / الجذر
        this.lastTime = 0;
        this.fps = 60;
        this.running = false;
        this.requestId = null;

        // ================= Performance =================
        this.deltaTime = 0;
    }

    // ================= Stage Management =================
    setRoot(root) { this.root = root; }

    // ================= Start / Stop =================
    start() {
        this.running = true;
        this.lastTime = performance.now();
        this._renderLoop();
    }

    stop() {
        this.running = false;
        if(this.requestId) cancelAnimationFrame(this.requestId);
    }

    // ================= Render Loop =================
    _renderLoop() {
        if(!this.running) return;

        const now = performance.now();
        this.deltaTime = now - this.lastTime;

        if(this.deltaTime >= 1000 / this.fps) {
            this.lastTime = now;
            this.clear();
            if(this.root && typeof this.root.draw === "function") {
                this.root.draw(this.ctx); // يفترض كل Display object له draw()
            }
        }

        this.requestId = requestAnimationFrame(() => this._renderLoop());
    }

    // ================= Clear Canvas =================
    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    // ================= Set FPS =================
    setFPS(fps) { this.fps = fps; }

    // ================= Resize Canvas =================
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.width = width;
        this.height = height;
    }
}

/*==================================================
  END OF Renderer_Core.js
==================================================*/