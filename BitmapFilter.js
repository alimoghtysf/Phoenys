/*==================================================
  BitmapFilter.js
  Applies filters to any DisplayObject
==================================================*/

export function applyFilters(displayObject){
    if(!displayObject.filters || displayObject.filters.length === 0) return;
    const ctx = displayObject._canvas?.getContext("2d");
    if(!ctx) return;

    for(let filter of displayObject.filters){
        filter.apply(ctx, 0, 0, displayObject.width, displayObject.height);
    }
}