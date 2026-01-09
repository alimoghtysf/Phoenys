/*==================================================
  AudioSystem.js
  Full AS3 Audio System - Stronger than Flash Player
==================================================*/

export class Sound {
    constructor(src=null) {
        this.src = src;
        this.audio = src ? new Audio(src) : null;
        this.loop = false;
        this.volume = 1.0;
        this.pan = 0; // -1 left, 1 right
        this.context = null;
        this.sourceNode = null;
        this.pannerNode = null;
        this.gainNode = null;
    }

    load(src) {
        this.src = src;
        this.audio = new Audio(src);
        this.audio.crossOrigin = "anonymous";
    }

    _initWebAudio() {
        if(!this.audio) return;
        if(this.context) return;
        this.context = new (window.AudioContext || window.webkitAudioContext)();
        this.sourceNode = this.context.createMediaElementSource(this.audio);
        this.pannerNode = this.context.createStereoPanner();
        this.gainNode = this.context.createGain();
        this.sourceNode.connect(this.pannerNode).connect(this.gainNode).connect(this.context.destination);
    }

    play(startTime = 0, loops = 0) {
        if(!this.audio) return;
        this._initWebAudio();
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
        if(this.gainNode) this.gainNode.gain.value = vol;
        if(this.audio) this.audio.volume = vol;
    }

    setPan(pan) {
        this.pan = Math.max(-1, Math.min(1, pan));
        if(this.pannerNode) this.pannerNode.pan.value = this.pan;
    }

    fadeTo(targetVol, duration=1000) {
        if(!this.gainNode) return;
        const current = this.gainNode.gain.value;
        const startTime = this.context.currentTime;
        this.gainNode.gain.linearRampToValueAtTime(targetVol, startTime + duration/1000);
    }
}

// ===================== SoundChannel ===================
export class SoundChannel {
    constructor(sound) {
        this.sound = sound;
    }

    play(startTime=0, loops=0) {
        this.sound.play(startTime, loops);
    }

    stop() {
        this.sound.stop();
    }

    setVolume(vol) {
        this.sound.setVolume(vol);
    }

    setPan(pan) {
        this.sound.setPan(pan);
    }

    fadeTo(vol, duration=1000) {
        this.sound.fadeTo(vol, duration);
    }
}

// ===================== AudioSystem ===================
export class AudioSystem {
    constructor() {
        this.sounds = [];
        this.channels = [];
    }

    addSound(sound) {
        this.sounds.push(sound);
        const channel = new SoundChannel(sound);
        this.channels.push(channel);
        return channel;
    }

    playAll() {
        for(let ch of this.channels) ch.play();
    }

    stopAll() {
        for(let ch of this.channels) ch.stop();
    }

    setGlobalVolume(vol) {
        for(let ch of this.channels) ch.setVolume(vol);
    }
}

// ===================== Effects Utilities ===================
export function applyReverb(sound, impulseResponseUrl) {
    if(!sound.context) sound._initWebAudio();
    const convolver = sound.context.createConvolver();
    fetch(impulseResponseUrl)
        .then(r => r.arrayBuffer())
        .then(buf => sound.context.decodeAudioData(buf))
        .then(decoded => {
            convolver.buffer = decoded;
            sound.sourceNode.disconnect();
            sound.sourceNode.connect(convolver).connect(sound.pannerNode).connect(sound.gainNode).connect(sound.context.destination);
        });
}

/*==================================================
  END OF AudioSystem.js
==================================================*/