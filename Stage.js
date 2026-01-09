/*==================================================
  Stage.js
  Full Flash-like Stage for MovieClip & Events
==================================================*/

import { EventDispatcher } from "./EventDispatcher.js";

export class Stage extends EventDispatcher {
    constructor(canvas, fps=60){
        super();
        this.canvas = canvas;
        this.renderer = canvas.getContext("webgl") || canvas.getContext("2d");
        this.children = [];
        this.fps = fps;
        this.interval = 1000 / fps;
        this.lastTime = performance.now();
        this.running = false;

        // Mouse tracking
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseDown = false;

        // Key tracking
        this.keys = {};

        this._setupEvents();
    }

    _setupEvents(){
        // Mouse
        this.canvas.addEventListener("mousemove", e=>{
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
            this.dispatchEvent({type:"MOUSE_MOVE", x:this.mouseX, y:this.mouseY});
        });
        this.canvas.addEventListener("mousedown", e=>{
            this.mouseDown = true;
            this.dispatchEvent({type:"MOUSE_DOWN", x:this.mouseX, y:this.mouseY});
        });
        this.canvas.addEventListener("mouseup", e=>{
            this.mouseDown = false;
            this.dispatchEvent({type:"MOUSE_UP", x:this.mouseX, y:this.mouseY});
        });

        // Keyboard
        window.addEventListener("keydown", e=>{
            this.keys[e.code] = true;
            this.dispatchEvent({type:"KEY_DOWN", code:e.code});
        });
        window.addEventListener("keyup", e=>{
            this.keys[e.code] = false;
            this.dispatchEvent({type:"KEY_UP", code:e.code});
        });
    }

    addChild(obj){
        this.children.push(obj);
    }

    removeChild(obj){
        const idx = this.children.indexOf(obj);
        if(idx>=0) this.children.splice(idx,1);
    }

    start(){
        this.running = true;
        this.lastTime = performance.now();
        requestAnimationFrame(this._loop.bind(this));
    }

    stop(){
        this.running = false;
    }

    _loop(now){
        if(!this.running) return;

        const delta = now - this.lastTime;
        if(delta >= this.interval){
            this.dispatchEvent({type:"ENTER_FRAME", delta: delta/1000});
            this._update(delta/1000);
            this._draw();
            this.lastTime = now;
        }
        requestAnimationFrame(this._loop.bind(this));
    }

    _update(delta){
        for(let child of this.children){
            if(child.update) child.update(delta);
        }
    }

    _draw(){
        if(!this.renderer) return;

        if(this.renderer.clearRect) this.renderer.clearRect(0,0,this.canvas.width,this.canvas.height);
        // ممكن نضيف WebGL clear بعدين إذا نستخدم shaders
        for(let child of this.children){
            if(child.update) child.update(); // كل MovieClip يرسم نفسه
        }
    }
}

/*==================================================
  END OF Stage.js
==================================================*/