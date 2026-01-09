/*==================================================
  Display(7).js
  Display core for AS3 full support (PART 7)
  AudioSystem Integration
==================================================*/

import { DisplayObject } from "./Display(1).js";

// ===================== Audio System ===================
export class Sound {
    constructor(src=null) {
        this.src = src;
        this.audio = src ? new Audio(src) : null;
        this.loop = false;
        this.volume = 1.0;
        this.pan = 0; // -1 left, 1 right
    }

    load(src) {
        this.src = src;
        this.audio = new Audio(src);
    }

    play(startTime = 0, loops = 0) {
        if(!this.audio) return;
        this.audio.currentTime = startTime;
        this.audio.loop = loops > 0;
        this.audio.play();
    }

    stop() {
        if(!this.audio) return;
        this.audio.pause();
        this.audio.currentTime = 0;
    }

    setVolume(vol) {
        this.volume = vol;
        if(this.audio) this.audio.volume = vol;
    }

    setPan(pan) {
        this.pan = Math.max(-1, Math.min(1, pan));
        if(this.audio) {
            const context = new (window.AudioContext || window.webkitAudioContext)();
            const source = context.createMediaElementSource(this.audio);
            const panner = context.createStereoPanner();
            panner.pan.value = this.pan;
            source.connect(panner).connect(context.destination);
        }
    }
}

export class SoundChannel {
    constructor(sound) {
        this.sound = sound;
    }

    stop() {
        if(this.sound) this.sound.stop();
    }

    setVolume(vol) {
        if(this.sound) this.sound.setVolume(vol);
    }

    setPan(pan) {
        if(this.sound) this.sound.setPan(pan);
    }
}

export class AudioSystem {
    constructor() {
        this.sounds = [];
    }

    addSound(sound) {
        this.sounds.push(sound);
    }

    playAll() {
        for(let s of this.sounds) s.play();
    }

    stopAll() {
        for(let s of this.sounds) s.stop();
    }
}

export const audioSystem = new AudioSystem();

/*==================================================
  END OF Display(7).js
==================================================*/