/*==================================================
  BlendModes.js
  Full AS3 Blend Modes + GPU Optimized
==================================================*/

export const BlendModes = {
    NORMAL: "source-over",
    LAYER: "source-over",
    MULTIPLY: "multiply",
    SCREEN: "screen",
    LIGHTEN: "lighten",
    DARKEN: "darken",
    ADD: "lighter",
    SUBTRACT: "subtract",
    DIFFERENCE: "difference",
    INVERT: "invert",
    ALPHA: "destination-in",
    ERASE: "destination-out",
    OVERLAY: "overlay",
    HARDLIGHT: "hard-light",
    SOFTLIGHT: "soft-light",
    DODGE: "color-dodge",
    BURN: "color-burn"
};

export function applyBlendMode(ctx, blendMode){
    const mode = BlendModes[blendMode.toUpperCase()] || BlendModes.NORMAL;
    ctx.globalCompositeOperation = mode;
}