const audio = {
    correctAnswerSound: './src/assets/audio/correct-choice.mp3',
    wrongAnswerSound: './src/assets/audio/wrong-choice.mp3',
    tictacSound: './src/assets/audio/tic-tac.mp3',
    tictacEndingSound: './src/assets/audio/timer-ending.mp3',
    swooshSound: './src/assets/audio/swoosh.mp3',
    keyboardSound: './src/assets/audio/keyboard.wav',
    ostSound: './src/assets/audio/ost.mp3'
};

let Sound = {};

Sound.renderCorrectAnswer = function() {
    const audioElement = document.getElementById('correctAnswerSound');
    audioElement.src= audio.correctAnswerSound;
    if (audioElement) {
        audioElement.play();    
    } else {
        console.error('Element with id "correctAnswerSound" not found.');
    }
};

Sound.renderWrongAnswer = function() {
    const audioElement = document.getElementById('wrongAnswerSound');
    audioElement.src = audio.wrongAnswerSound;
    if (audioElement) {
        audioElement.play();
    } else {
        console.error('Element with id "wrongAnswerSound" not found.');
    }
};

Sound.renderTictac = function(){
    const audioElement = document.getElementById('tictacSound');
    audioElement.src = audio.tictacSound;
    if(audioElement){
        audioElement.play();
    }
    else{
        console.error('Element with id "tictacSound" not found.');
    }
}

Sound.stopTictac = function(){
    const audioElement = document.getElementById('tictacSound');
    if(audioElement){
        audioElement.pause();
    }
    else{
        console.error('Element with id "tictacSound" not found.');
    }
};

Sound.renderTictacEnding = function(){
    const audioElement = document.getElementById('tictacEndingSound');
    audioElement.src = audio.tictacEndingSound;
    if(audioElement){
        audioElement.play();
    }
    else{
        console.error('Element with id "tictacEndingSound" not found.');
    }
};

Sound.renderSwoosh = function(){
    const audioElement = document.getElementById('swooshSound');
    audioElement.src = audio.swooshSound;
    if(audioElement){
        audioElement.play();
    }
    else{
        console.error('Element with id "swooshSound" not found.');
    }
};

Sound.keyboardSound = function(){
    const audioElement = document.getElementById('keyboardSound');
    audioElement.src = audio.keyboardSound;
    if(audioElement){
        audioElement.play();
    }
    else{
        console.error('Element with id "keyboardSound" not found.');
    }
};  

Sound.renderOST = function(){
    const audioElement = document.getElementById('ostSound');
    audioElement.src = audio.ostSound;
    if(audioElement){
        audioElement.play();
    }
    else{
        console.error('Element with id "ostSound" not found.');
    }
}

export { Sound };