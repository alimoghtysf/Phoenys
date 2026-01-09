/*==================================================
  Display(9).js
  Display core for AS3 full support (PART 9)
  Advanced Filters & Dynamic Masking
==================================================*/

import { DisplayObject, MovieClip, Graphics } from "./Display(1).js";
import { BlurFilter, DropShadowFilter, ColorTransform } from "./Display(4).js";

// ===================== Advanced Filters ===================
DisplayObject.prototype.filters = [];

DisplayObject.prototype.addFilter = function(filter) {
    this.filters.push(filter);
};

DisplayObject.prototype.removeFilter = function(filter) {
    this.filters = this.filters.filter(f => f !== filter);
};

DisplayObject.prototype.clearFilters = function() {
    this.filters = [];
};

// ===================== Dynamic Masking ===================
DisplayObject.prototype.setMask = function(maskObj) {
    this.mask = maskObj;
};

// ===================== MovieClip Enhancements ===================
MovieClip.prototype.addFrameScript = function(frameIndex, func) {
    if (!this.timeline.frames[frameIndex]) return;
    this.timeline.frames[frameIndex].actions.push(func);
};

MovieClip.prototype._executeFrameActions = function() {
    const frame = this.timeline.current;
    if (!frame || !frame.actions) return;
    for (let act of frame.actions) {
        try { act.call(this); } catch(e){ console.error(e); }
    }
};

// ===================== Graphics Enhancements ===================
Graphics.prototype.clear = function() {
    this.commands = [];
};

Graphics.prototype.clone = function() {
    const g = new Graphics();
    g.commands = JSON.parse(JSON.stringify(this.commands));
    g.fillStyle = this.fillStyle;
    g.strokeStyle = this.strokeStyle;
    g.lineWidth = this.lineWidth;
    return g;
};

/*==================================================
  END OF Display(9).js
==================================================*/