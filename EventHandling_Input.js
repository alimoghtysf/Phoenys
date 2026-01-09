/*==================================================
  EventHandling_Input.js
  Full Mouse & Keyboard Event System for AS3
==================================================*/

import {EventDispatcher} from './EventDispatcher.js';
import {MovieClip} from './MovieClip_Timeline.js';

export class MouseEvent {
    constructor(type, target, x=0, y=0) {
        this.type = type;
        this.target = target;
        this.x = x;
        this.y = y;
    }
}

export class KeyboardEvent {
    constructor(type, keyCode) {
        this.type = type;
        this.keyCode = keyCode;
    }
}

// ===================== Input Manager =====================
export class InputManager {
    constructor(canvas, stage) {
        this.canvas = canvas;
        this.stage = stage;

        this.mouseX = 0;
        this.mouseY = 0;
        this.keys = {};

        // Bind Events
        canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
        canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
        canvas.addEventListener("mouseup", this.onMouseUp.bind(this));
        window.addEventListener("keydown", this.onKeyDown.bind(this));
        window.addEventListener("keyup", this.onKeyUp.bind(this));
    }

    onMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
        this.dispatchMouseEvent("mouseMove");
    }

    onMouseDown(e) {
        this.dispatchMouseEvent("mouseDown");
    }

    onMouseUp(e) {
        this.dispatchMouseEvent("mouseUp");
    }

    onKeyDown(e) {
        this.keys[e.keyCode] = true;
        this.dispatchKeyboardEvent("keyDown", e.keyCode);
    }

    onKeyUp(e) {
        this.keys[e.keyCode] = false;
        this.dispatchKeyboardEvent("keyUp", e.keyCode);
    }

    dispatchMouseEvent(type) {
        const target = this.hitTestMovieClips(this.mouseX, this.mouseY);
        if(target) {
            target.dispatchEvent(new MouseEvent(type, target, this.mouseX, this.mouseY));
        }
    }

    dispatchKeyboardEvent(type, keyCode) {
        // نرسل لجميع MovieClips المهتمة بالكيبورد
        this.stage.children.forEach(clip => {
            if(clip instanceof MovieClip) {
                clip.dispatchEvent(new KeyboardEvent(type, keyCode));
            }
        });
    }

    hitTestMovieClips(x, y) {
        // يتحقق أي MovieClip تحت الماوس (أبسط طريقة)
        for(let i = this.stage.children.length-1; i>=0; i--) {
            const clip = this.stage.children[i];
            if(clip.x <= x && x <= clip.x + clip.width &&
               clip.y <= y && y <= clip.y + clip.height) {
                return clip;
            }
        }
        return null;
    }
}

/*==================================================
  END OF EventHandling_Input.js
==================================================*/