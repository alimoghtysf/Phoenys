/*==================================================
  Display(1).js
  Display core for AS3 full support (PART 1)
==================================================*/

export class DisplayObject {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.rotation = 0; // degrees
        this.visible = true;
        this.alpha = 1.0;
        this.parent = null;
        this.children = [];
        this.stage = null;
        this.name = "";
        this.filters = [];
        this.mask = null;
    }

    addChild(child) {
        if (child.parent) {
            child.parent.removeChild(child);
        }
        child.parent = this;
        child.stage = this.stage;
        this.children.push(child);
    }

    removeChild(child) {
        const index = this.children.indexOf(child);
        if (index >= 0) {
            this.children.splice(index, 1);
            child.parent = null;
            child.stage = null;
        }
    }

    get numChildren() {
        return this.children.length;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    setSize(width, height) {
        this.width = width;
        this.height = height;
    }

    _updateStage(stage) {
        this.stage = stage;
        for (let child of this.children) {
            child._updateStage(stage);
        }
    }

    _render(ctx) {
        if (!this.visible) return;
        ctx.save();
        ctx.globalAlpha *= this.alpha;
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.scale(this.scaleX, this.scaleY);

        for (let child of this.children) {
            child._render(ctx);
        }

        ctx.restore();
    }
}

export class Sprite extends DisplayObject {
    constructor() {
        super();
        this.graphics = new Graphics();
    }

    _render(ctx) {
        if (!this.visible) return;
        ctx.save();
        ctx.globalAlpha *= this.alpha;
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.scale(this.scaleX, this.scaleY);

        this.graphics._draw(ctx); // رسم المحتوى
        for (let child of this.children) {
            child._render(ctx);
        }

        ctx.restore();
    }
}

export class Stage extends Sprite {
    constructor(canvas) {
        super();
        this.canvas = canvas;
        this.renderer = canvas.getContext("2d");
        this.frameRate = 60;
        this._lastTime = performance.now();
        this._startLoop();
    }

    _startLoop() {
        const loop = (time) => {
            const dt = (time - this._lastTime) / 1000;
            this._lastTime = time;
            this._render(this.renderer);
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }
}

export class Graphics {
    constructor() {
        this.commands = [];
        this.fillStyle = "#000000";
        this.strokeStyle = null;
        this.lineWidth = 1;
    }

    beginFill(color) {
        this.fillStyle = color;
    }

    lineStyle(width = 1, color = "#000000") {
        this.lineWidth = width;
        this.strokeStyle = color;
    }

    moveTo(x, y) {
        this.commands.push({ type: "moveTo", x, y });
    }

    lineTo(x, y) {
        this.commands.push({ type: "lineTo", x, y });
    }

    _draw(ctx) {
        if (this.commands.length === 0) return;
        ctx.beginPath();
        let start = true;
        for (let cmd of this.commands) {
            if (cmd.type === "moveTo") {
                ctx.moveTo(cmd.x, cmd.y);
            } else if (cmd.type === "lineTo") {
                ctx.lineTo(cmd.x, cmd.y);
            }
        }
        if (this.fillStyle) {
            ctx.fillStyle = this.fillStyle;
            ctx.fill();
        }
        if (this.strokeStyle) {
            ctx.strokeStyle = this.strokeStyle;
            ctx.lineWidth = this.lineWidth;
            ctx.stroke();
        }
    }
}

/*==================================================
  END OF Display(1).js
==================================================*/