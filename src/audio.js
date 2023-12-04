
let audio = {
    opening: new Audio(),
    world: new Audio(),
    battle: new Audio(),

    exclamation: new Audio(),
};

let currentSong = null;

function playAudioObject(obj) {
    obj.pause();
    obj.currentTime = 0;
    obj.play();
}

function songPlaying(song) {
    return currentSong === song;
}

function setSong(song) {
    if (currentSong === song) {
        return;
    }
    if (currentSong !== null) {
        currentSong.pause();
    }
    currentSong = song;
    if (song === null) {
        return;
    }
    song.loop = true;
    playAudioObject(song);
}

function playEffect(eff) {
    playAudioObject(eff);
}

function initAudio(assets) {
    audio = assets;
}
