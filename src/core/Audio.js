/**
 * Audio.js - Gestionnaire audio du jeu
 * Sons, musique et effets sonores
 */

const Audio = {
    // Collections de sons
    sounds: {},
    music: null,

    // Configuration
    config: {
        masterVolume: 1.0,
        musicVolume: 0.5,
        sfxVolume: 0.8,
        isMuted: false
    },

    /**
     * Initialise le module audio
     */
    init: function() {
        console.log('[Audio] Initialisation...');
        
        // Précharger les sons de base
        this.preloadSounds();
    },

    /**
     * Précharge les sons du jeu
     */
    preloadSounds: function() {
        // Définir les sons à charger (utilise les fichiers audio existants)
        const soundsToLoad = {
            // UI
            click: './src/assets/audio/keyboard.mp3',
            
            // Gameplay
            correct: './src/assets/audio/correct-choice.mp3',
            wrong: './src/assets/audio/wrong-choice.mp3',
            ding: './src/assets/audio/swoosh.mp3',
            pickup: './src/assets/audio/keyboard.mp3',
            
            // Timer
            tick: './src/assets/audio/tic-tac.mp3',
            countdown: './src/assets/audio/timer-ending.mp3',
            
            // Music
            bgMusic: './src/assets/audio/funk.mp3',
            ost: './src/assets/audio/ost.mp3'
        };

        // Charger chaque son
        for (const [name, path] of Object.entries(soundsToLoad)) {
            this.load(name, path);
        }
    },

    /**
     * Charge un son
     * @param {string} name - Nom du son
     * @param {string} path - Chemin du fichier
     */
    load: function(name, path) {
        const audio = new window.Audio();
        audio.src = path;
        audio.preload = 'auto';
        
        // Gérer les erreurs silencieusement (les fichiers peuvent ne pas exister encore)
        audio.onerror = () => {
            console.warn(`[Audio] Impossible de charger: ${path}`);
        };

        this.sounds[name] = audio;
    },

    /**
     * Joue un son
     * @param {string} name - Nom du son
     * @param {object} options - Options (volume, loop, etc.)
     */
    play: function(name, options = {}) {
        if (this.config.isMuted) return;

        const sound = this.sounds[name];
        if (!sound) {
            console.warn(`[Audio] Son non trouvé: ${name}`);
            return;
        }

        // Cloner le son pour permettre plusieurs lectures simultanées
        const clone = sound.cloneNode();
        clone.volume = (options.volume || 1) * this.config.sfxVolume * this.config.masterVolume;
        clone.loop = options.loop || false;

        clone.play().catch(err => {
            // L'autoplay peut être bloqué par le navigateur
            console.warn('[Audio] Lecture bloquée:', err.message);
        });

        return clone;
    },

    /**
     * Joue la musique de fond
     * @param {string} name - Nom de la musique
     */
    playMusic: function(name = 'bgMusic') {
        if (this.config.isMuted) return;

        // Arrêter la musique actuelle
        this.stopMusic();

        const music = this.sounds[name];
        if (!music) {
            console.warn(`[Audio] Musique non trouvée: ${name}`);
            return;
        }

        this.music = music.cloneNode();
        this.music.volume = this.config.musicVolume * this.config.masterVolume;
        this.music.loop = true;

        this.music.play().catch(err => {
            console.warn('[Audio] Musique bloquée:', err.message);
        });
    },

    /**
     * Arrête la musique
     */
    stopMusic: function() {
        if (this.music) {
            this.music.pause();
            this.music.currentTime = 0;
            this.music = null;
        }
    },

    /**
     * Met en pause/reprend la musique
     */
    toggleMusic: function() {
        if (this.music) {
            if (this.music.paused) {
                this.music.play();
            } else {
                this.music.pause();
            }
        }
    },

    /**
     * Active/désactive le son
     */
    toggleMute: function() {
        this.config.isMuted = !this.config.isMuted;
        
        if (this.config.isMuted) {
            this.stopMusic();
        }

        return this.config.isMuted;
    },

    /**
     * Définit le volume principal
     * @param {number} volume - Volume de 0 à 1
     */
    setMasterVolume: function(volume) {
        this.config.masterVolume = Math.max(0, Math.min(1, volume));
        
        if (this.music) {
            this.music.volume = this.config.musicVolume * this.config.masterVolume;
        }
    },

    /**
     * Définit le volume de la musique
     * @param {number} volume - Volume de 0 à 1
     */
    setMusicVolume: function(volume) {
        this.config.musicVolume = Math.max(0, Math.min(1, volume));
        
        if (this.music) {
            this.music.volume = this.config.musicVolume * this.config.masterVolume;
        }
    },

    /**
     * Définit le volume des effets sonores
     * @param {number} volume - Volume de 0 à 1
     */
    setSfxVolume: function(volume) {
        this.config.sfxVolume = Math.max(0, Math.min(1, volume));
    },

    /**
     * Joue un son 3D positionné dans l'espace
     * @param {string} name - Nom du son
     * @param {object} position - Position {x, y, z}
     */
    playPositional: function(name, position) {
        // Créer un élément a-sound pour le son 3D
        const soundEntity = document.createElement('a-entity');
        soundEntity.setAttribute('position', `${position.x} ${position.y} ${position.z}`);
        soundEntity.setAttribute('sound', {
            src: this.sounds[name]?.src || '',
            autoplay: true,
            volume: this.config.sfxVolume * this.config.masterVolume
        });

        document.querySelector('a-scene').appendChild(soundEntity);

        // Supprimer après lecture
        setTimeout(() => {
            soundEntity.remove();
        }, 5000);
    }
};

export { Audio };
