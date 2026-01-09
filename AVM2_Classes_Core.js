/*==================================================
  AVM2_Classes_Core.js
  Core AS3 Classes - Base for all DisplayObjects & AVM2
==================================================*/

export class ASObject {
    constructor() {
        this.__traits = {};
        this.__namespace = "public"; // default namespace
    }

    getTrait(name) {
        return this.__traits[name];
    }

    setTrait(name, value) {
        this.__traits[name] = value;
    }
}

// ================= DisplayObject Base =================
export class DisplayObject extends ASObject {
    constructor() {
        super();
        this.x = 0;
        this.y = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.rotation = 0;
        this.alpha = 1;
        this.visible = true;
        this.parent = null;
        this.stage = null;
    }

    globalPosition() {
        let gx = this.x;
        let gy = this.y;
        let obj = this.parent;
        while(obj) {
            gx += obj.x;
            gy += obj.y;
            obj = obj.parent;
        }
        return {x: gx, y: gy};
    }
}

// ================= InteractiveObject =================
export class InteractiveObject extends DisplayObject {
    constructor() {
        super();
        this.mouseEnabled = true;
        this.tabEnabled = false;
        this.focusRect = false;
        this.doubleClickEnabled = false;
    }
}

// ================= Sprite =================
export class Sprite extends InteractiveObject {
    constructor() {
        super();
        this.children = [];
    }

    addChild(child) {
        if(child.parent) child.parent.removeChild(child);
        child.parent = this;
        this.children.push(child);
    }

    removeChild(child) {
        const index = this.children.indexOf(child);
        if(index >= 0) {
            child.parent = null;
            this.children.splice(index,1);
        }
    }

    getChildAt(index) {
        return this.children[index];
    }

    numChildren() {
        return this.children.length;
    }
}

// ================= Stage =================
export class Stage extends Sprite {
    constructor(canvas) {
        super();
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.frameRate = 24;
        this.onEnterFrame = null;
    }

    render() {
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
        for(let child of this.children) {
            if(child.visible) {
                // بسيط: رسم مستطيل كمثال
                this.context.save();
                const pos = child.globalPosition();
                this.context.globalAlpha = child.alpha;
                this.context.translate(pos.x, pos.y);
                this.context.fillStyle = 'white';
                this.context.fillRect(0,0,50,50); // placeholder
                this.context.restore();
            }
        }
    }

    start() {
        const loop = () => {
            this.render();
            if(this.onEnterFrame) this.onEnterFrame();
            requestAnimationFrame(loop);
        };
        loop();
    }
}

/*==================================================
  END OF AVM2_Classes_Core.js
==================================================*/