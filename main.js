// نقطة البداية للمحرك
import { GPURenderer } from "./GPURenderer.js";
import { MovieClip, Frame } from "./MovieClip.js";
import { AudioSystem, Sound } from "./AudioSystem.js";
import { SWFParser } from "./SWFParser(1).js"; // يتغير حسب مشروعك

const canvas = document.getElementById("gameCanvas");
const renderer = new GPURenderer(canvas);

// ==================== Audio ====================
const audioSystem = new AudioSystem();

// مثال: تحميل صوت
const bgMusic = new Sound("assets/music.mp3");
audioSystem.addSound(bgMusic);
bgMusic.play();

// ==================== SWF Load ====================
async function loadSWF(url){
    const swfParser = new SWFParser();
    const swfData = await fetch(url).then(r => r.arrayBuffer());
    swfParser.parse(swfData);

    // نفترض أن الملف يرجع Main MovieClip
    return swfParser.getMainMovieClip(renderer);
}

// ==================== Main Game ====================
let mainClip = null;

loadSWF("assets/game.swf").then(clip => {
    mainClip = clip;
    gameLoop();
});

// ==================== Game Loop ====================
let lastTime = performance.now();
function gameLoop(time){
    const delta = time - lastTime;
    lastTime = time;

    // تنظيف الشاشة
    renderer.clear([0,0,0,1]);

    // تحديث ورسم اللعبة
    if(mainClip){
        mainClip.update(delta);
    }

    requestAnimationFrame(gameLoop);
}