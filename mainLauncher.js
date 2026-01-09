import { SWFParser } from './SWFParser(1).js';
import { AVM2Bytecode } from './AVM2_Bytecode.js';
import { AudioSystem } from './AudioSystem.js';
import * as Display from './Display(1).js';
import * as Renderer from './Renderer_Core.js';

const canvas = document.getElementById('flashCanvas');
const ctx = canvas.getContext('2d');

const avm2 = new AVM2Bytecode();
const audio = new AudioSystem();

let swfData = null;
let movieClipRoot = null;

// -------- Load SWF file --------
document.getElementById('fileInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = function() {
        const arrayBuffer = this.result;
        swfData = new Uint8Array(arrayBuffer);

        // Parse SWF
        const parser = new SWFParser(swfData);
        movieClipRoot = parser.parse();  // MovieClip الرئيسي
        startRendering();
    };
    reader.readAsArrayBuffer(file);
});

// -------- Rendering loop --------
function startRendering() {
    function loop() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        if(movieClipRoot) {
            Renderer.renderMovieClip(ctx, movieClipRoot);
        }
        requestAnimationFrame(loop);
    }
    loop();
}