/**
 * playSound.js - Helper simple pour jouer des sons
 * Fonction utilitaire globale pour jouer un son facilement
 */

/**
 * Joue un son simple
 * @param {string} soundName - Nom du son ('correct', 'wrong', 'ding', 'click', 'bonus', 'happening')
 * @param {number} volume - Volume de 0 à 1 (défaut: 0.5)
 */
export function playSound(soundName, volume = 0.5) {
    try {
        // Créer un élément audio temporaire
        const audio = new Audio();
        
        // Mapper les noms de sons vers les fichiers
        const soundPaths = {
            'correct': '/assets/sounds/correct-sound.mp3',
            'wrong': '/assets/sounds/wrong-sound.mp3',
            'ding': '/assets/sounds/ding.mp3',
            'click': '/assets/sounds/click.mp3',
            'bonus': '/assets/sounds/bonus.mp3',
            'happening': '/assets/sounds/happening.mp3'
        };
        
        // Vérifier que le son existe
        if (!soundPaths[soundName]) {
            console.warn(`Son inconnu: ${soundName}`);
            return false;
        }
        
        console.log(`🔊 Tentative de lecture: ${soundName} (volume: ${volume})`);
        
        // Configurer et jouer le son
        audio.src = soundPaths[soundName];
        audio.volume = Math.max(0, Math.min(1, volume));
        
        // Jouer le son
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log(`✅ Son joué avec succès: ${soundName}`);
                })
                .catch(error => {
                    console.warn(`⚠️ Impossible de jouer le son ${soundName}:`, error.message);
                    console.warn(`💡 Assurez-vous que le fichier existe: ${soundPaths[soundName]}`);
                    
                    // Jouer un beep de secours pour le son "ding"
                    if (soundName === 'ding') {
                        playBeep();
                    }
                });
        }
        
        // Nettoyer après la lecture
        audio.addEventListener('ended', () => {
            audio.remove();
        });
        
        return true;
    } catch (error) {
        console.warn(`Erreur lors de la lecture du son ${soundName}:`, error);
        
        // Jouer un beep de secours pour le son "ding"
        if (soundName === 'ding') {
            playBeep();
        }
        
        return false;
    }
}

/**
 * Joue un beep de secours avec l'API Web Audio
 */
function playBeep() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Configuration du beep
        oscillator.frequency.value = 800; // Fréquence en Hz
        oscillator.type = 'sine';
        
        // Volume avec fade out
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        // Jouer
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
        
        console.log('🔔 Beep de secours joué');
    } catch (error) {
        console.warn('Impossible de jouer le beep de secours:', error);
    }
}

/**
 * Joue une musique en boucle
 * @param {string} musicName - Nom de la musique ('menuMusic', 'gameMusic')
 * @param {number} volume - Volume de 0 à 1 (défaut: 0.3)
 * @returns {HTMLAudioElement|null} - Élément audio pour contrôler la musique
 */
export function playMusic(musicName, volume = 0.3) {
    try {
        const audio = new Audio();
        
        const musicPaths = {
            'menuMusic': '/assets/sounds/menu-music.mp3',
            'gameMusic': '/assets/sounds/game-music.mp3'
        };
        
        if (!musicPaths[musicName]) {
            console.warn(`Musique inconnue: ${musicName}`);
            return null;
        }
        
        audio.src = musicPaths[musicName];
        audio.volume = Math.max(0, Math.min(1, volume));
        audio.loop = true;
        
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.warn(`⚠️ Impossible de jouer la musique ${musicName}:`, error.message);
            });
        }
        
        return audio;
    } catch (error) {
        console.warn(`Erreur lors de la lecture de la musique ${musicName}:`, error);
        return null;
    }
}

/**
 * Arrête une musique
 * @param {HTMLAudioElement} audioElement - Élément audio à arrêter
 */
export function stopMusic(audioElement) {
    if (audioElement && audioElement.pause) {
        audioElement.pause();
        audioElement.currentTime = 0;
    }
}
