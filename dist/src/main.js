
import { Leaderboard } from './components/leaderboard/leaderboard.js';
import { Rounds } from './components/rounds/rounds.js';
import { Vr } from './components/vr/vr.js';
import { Sound } from './components/audio/audio.js';




Vr.setupControllerClickHandler();

// Appeler la vérification en continu pendant la scène
function update() {
    // SortItOut.ChekIfInside();
    requestAnimationFrame(update); // Continuer l'appel à chaque frame
}

// Démarre la vérification continue
update();

// Second mini game
setTimeout(() => {
    console.log("Games reimported")
    Rounds.startGame();
    Leaderboard.renderZone();
}, 5000);