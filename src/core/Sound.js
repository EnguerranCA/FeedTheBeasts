/**
 * Sound Manager - Gère tous les sons du jeu Feed the Beast
 */
export class SoundManager {
    constructor() {
        this.sounds = new Map();
        this.musicVolume = 0.7;
        this.sfxVolume = 0.8;
        this.isMuted = false;
        this.currentMusic = null;
        
        // Initialiser le contexte audio
        this.audioContext = null;
        this.masterGain = null;
    }

    /**
     * Initialise le système audio
     */
    init() {
        try {
            // Créer le contexte audio (nécessite une interaction utilisateur)
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.connect(this.audioContext.destination);
            
            console.log('Sound Manager initialisé');
            return true;
        } catch (error) {
            console.error('Erreur lors de l\'initialisation du Sound Manager:', error);
            return false;
        }
    }

    /**
     * Charge un fichier audio
     * @param {string} name - Nom unique pour identifier le son
     * @param {string} path - Chemin vers le fichier audio
     * @param {boolean} loop - Si le son doit boucler
     * @param {string} type - Type de son ('music' ou 'sfx')
     */
    async loadSound(name, path, loop = false, type = 'sfx') {
        try {
            const audio = new Audio(path);
            audio.loop = loop;
            audio.volume = type === 'music' ? this.musicVolume : this.sfxVolume;
            
            // Précharger l'audio
            await new Promise((resolve, reject) => {
                audio.addEventListener('canplaythrough', resolve, { once: true });
                audio.addEventListener('error', reject, { once: true });
                audio.load();
            });

            this.sounds.set(name, {
                audio,
                type,
                isPlaying: false
            });

            console.log(`✅ Son chargé: ${name}`);
            return true;
        } catch (error) {
            console.warn(`⚠️ Impossible de charger le son ${name} (${path}) - Le jeu continuera sans ce son.`);
            // Créer un son muet pour éviter les erreurs
            const dummyAudio = {
                play: () => Promise.resolve(),
                pause: () => {},
                cloneNode: () => ({
                    play: () => Promise.resolve(),
                    pause: () => {},
                    volume: 0
                }),
                volume: 0,
                currentTime: 0,
                loop: false
            };
            
            this.sounds.set(name, {
                audio: dummyAudio,
                type,
                isPlaying: false
            });
            return false;
        }
    }

    /**
     * Charge plusieurs sons en parallèle
     * @param {Array} soundList - Liste d'objets {name, path, loop, type}
     */
    async loadSounds(soundList) {
        const promises = soundList.map(sound => 
            this.loadSound(sound.name, sound.path, sound.loop || false, sound.type || 'sfx')
        );
        
        const results = await Promise.allSettled(promises);
        const loaded = results.filter(r => r.status === 'fulfilled').length;
        
        console.log(`${loaded}/${soundList.length} sons chargés`);
        return results;
    }

    /**
     * Joue un son
     * @param {string} name - Nom du son à jouer
     * @param {number} volumeMultiplier - Multiplicateur de volume (0-1)
     */
    playSound(name, volumeMultiplier = 1.0) {
        const sound = this.sounds.get(name);
        
        if (!sound) {
            console.warn(`Son non trouvé: ${name}`);
            return false;
        }

        if (this.isMuted) {
            return false;
        }

        try {
            const { audio, type } = sound;
            
            // Cloner l'audio pour permettre plusieurs instances simultanées (pour les SFX)
            if (type === 'sfx' && !audio.loop && audio.cloneNode) {
                const clone = audio.cloneNode();
                clone.volume = this.sfxVolume * volumeMultiplier;
                const playPromise = clone.play();
                if (playPromise && playPromise.catch) {
                    playPromise.catch(err => console.warn('Erreur lecture son:', err));
                }
            } else {
                // Pour la musique ou les sons en boucle
                if (audio.currentTime !== undefined) {
                    audio.currentTime = 0;
                }
                audio.volume = (type === 'music' ? this.musicVolume : this.sfxVolume) * volumeMultiplier;
                const playPromise = audio.play();
                if (playPromise && playPromise.catch) {
                    playPromise.catch(err => console.warn('Erreur lecture son:', err));
                }
                sound.isPlaying = true;
            }

            return true;
        } catch (error) {
            console.warn(`Erreur lors de la lecture du son ${name}:`, error);
            return false;
        }
    }

    /**
     * Arrête un son
     * @param {string} name - Nom du son à arrêter
     */
    stopSound(name) {
        const sound = this.sounds.get(name);
        
        if (!sound) {
            console.warn(`Son non trouvé: ${name}`);
            return false;
        }

        try {
            sound.audio.pause();
            sound.audio.currentTime = 0;
            sound.isPlaying = false;
            return true;
        } catch (error) {
            console.error(`Erreur lors de l'arrêt du son ${name}:`, error);
            return false;
        }
    }

    /**
     * Met en pause un son
     * @param {string} name - Nom du son à mettre en pause
     */
    pauseSound(name) {
        const sound = this.sounds.get(name);
        
        if (!sound) {
            console.warn(`Son non trouvé: ${name}`);
            return false;
        }

        try {
            sound.audio.pause();
            sound.isPlaying = false;
            return true;
        } catch (error) {
            console.error(`Erreur lors de la pause du son ${name}:`, error);
            return false;
        }
    }

    /**
     * Reprend un son en pause
     * @param {string} name - Nom du son à reprendre
     */
    resumeSound(name) {
        const sound = this.sounds.get(name);
        
        if (!sound || this.isMuted) {
            return false;
        }

        try {
            const playPromise = sound.audio.play();
            if (playPromise && playPromise.catch) {
                playPromise.catch(err => console.warn('Erreur reprise son:', err));
            }
            sound.isPlaying = true;
            return true;
        } catch (error) {
            console.warn(`Erreur lors de la reprise du son ${name}:`, error);
            return false;
        }
    }

    /**
     * Joue une musique de fond
     * @param {string} name - Nom de la musique
     */
    playMusic(name) {
        // Arrêter la musique actuelle si elle existe
        if (this.currentMusic) {
            this.stopSound(this.currentMusic);
        }

        this.currentMusic = name;
        return this.playSound(name);
    }

    /**
     * Arrête la musique actuelle
     */
    stopMusic() {
        if (this.currentMusic) {
            this.stopSound(this.currentMusic);
            this.currentMusic = null;
        }
    }

    /**
     * Change le volume de la musique
     * @param {number} volume - Volume (0-1)
     */
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        
        // Mettre à jour tous les sons de type musique
        this.sounds.forEach((sound, name) => {
            if (sound.type === 'music') {
                sound.audio.volume = this.musicVolume;
            }
        });
    }

    /**
     * Change le volume des effets sonores
     * @param {number} volume - Volume (0-1)
     */
    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        
        // Mettre à jour tous les sons de type sfx
        this.sounds.forEach((sound, name) => {
            if (sound.type === 'sfx') {
                sound.audio.volume = this.sfxVolume;
            }
        });
    }

    /**
     * Active/désactive le mode muet
     * @param {boolean} muted - État muet
     */
    setMuted(muted) {
        this.isMuted = muted;
        
        if (muted) {
            // Mettre en pause tous les sons en cours
            this.sounds.forEach((sound, name) => {
                if (sound.isPlaying) {
                    sound.audio.pause();
                }
            });
        } else {
            // Reprendre tous les sons qui étaient en cours
            this.sounds.forEach((sound, name) => {
                if (sound.isPlaying) {
                    const playPromise = sound.audio.play();
                    if (playPromise && playPromise.catch) {
                        playPromise.catch(err => console.warn('Erreur reprise son:', err));
                    }
                }
            });
        }
    }

    /**
     * Bascule le mode muet
     */
    toggleMute() {
        this.setMuted(!this.isMuted);
        return this.isMuted;
    }

    /**
     * Fade in d'un son
     * @param {string} name - Nom du son
     * @param {number} duration - Durée du fade en ms
     */
    fadeIn(name, duration = 1000) {
        const sound = this.sounds.get(name);
        if (!sound) return false;

        const targetVolume = sound.type === 'music' ? this.musicVolume : this.sfxVolume;
        sound.audio.volume = 0;
        this.playSound(name);

        const steps = 50;
        const stepDuration = duration / steps;
        const volumeStep = targetVolume / steps;
        let currentStep = 0;

        const fadeInterval = setInterval(() => {
            currentStep++;
            sound.audio.volume = Math.min(volumeStep * currentStep, targetVolume);

            if (currentStep >= steps) {
                clearInterval(fadeInterval);
            }
        }, stepDuration);

        return true;
    }

    /**
     * Fade out d'un son
     * @param {string} name - Nom du son
     * @param {number} duration - Durée du fade en ms
     */
    fadeOut(name, duration = 1000) {
        const sound = this.sounds.get(name);
        if (!sound) return false;

        const startVolume = sound.audio.volume;
        const steps = 50;
        const stepDuration = duration / steps;
        const volumeStep = startVolume / steps;
        let currentStep = 0;

        const fadeInterval = setInterval(() => {
            currentStep++;
            sound.audio.volume = Math.max(startVolume - (volumeStep * currentStep), 0);

            if (currentStep >= steps) {
                clearInterval(fadeInterval);
                this.stopSound(name);
            }
        }, stepDuration);

        return true;
    }

    /**
     * Nettoie et libère les ressources
     */
    dispose() {
        this.sounds.forEach((sound, name) => {
            this.stopSound(name);
        });
        
        this.sounds.clear();
        
        if (this.audioContext) {
            this.audioContext.close();
        }
        
        console.log('Sound Manager nettoyé');
    }
}

// Exporter une instance singleton
export const soundManager = new SoundManager();
