/**
 * game-main.js - Point d'entrée principal du jeu Feed The Beasts
 * Initialise tous les modules et démarre le jeu
 */

// Import des modules Core
import { Game } from './core/Game.js';
import { VRController } from './core/VRController.js';
import { Camera } from './core/Camera.js';
import { Loading } from './core/Loading.js';
import { Audio } from './core/Audio.js';

// Import des composants
import { Monster } from './components/monster/monster.js';
import { GameObject } from './components/object/object.js';
import { Bonus } from './components/bonus/bonus.js';
import { Happenings } from './components/happenings/happenings.js';

/**
 * Application principale
 */
const App = {
    // État de l'application
    initialized: false,

    /**
     * Initialise l'application
     */
    init: async function() {
        console.log('=== Feed The Beasts ===');
        console.log('Initialisation de l\'application...');

        // Attendre que le DOM soit prêt
        if (document.readyState !== 'complete') {
            await new Promise(resolve => {
                window.addEventListener('load', resolve);
            });
        }

        // Initialiser le module de chargement en premier
        Loading.init();

        // Écouter la fin du chargement pour initialiser le reste
        document.addEventListener('loading:complete', () => {
            this.onLoadingComplete();
        });
    },

    /**
     * Appelé quand le chargement est terminé
     */
    onLoadingComplete: function() {
        console.log('Chargement terminé, initialisation des modules...');

        // Initialiser les modules Core
        Camera.init();
        VRController.init();
        Audio.init();

        // Initialiser les composants du jeu
        Monster.init();
        GameObject.init();
        Bonus.init();
        Happenings.init();

        // Initialiser le jeu en dernier
        Game.init();

        this.initialized = true;
        console.log('Application initialisée !');

        // Configurer les événements globaux
        this.setupGlobalEvents();
    },

    /**
     * Configure les événements globaux
     */
    setupGlobalEvents: function() {
        // Écouter les événements du jeu pour debug
        if (this.isDebugMode()) {
            this.setupDebugEvents();
        }

        // Gérer la perte de focus (pause)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && Game.state.isRunning) {
                Game.pause();
            }
        });

        // Écouter les touches clavier pour debug
        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e);
        });
    },

    /**
     * Vérifie si on est en mode debug
     * @returns {boolean}
     */
    isDebugMode: function() {
        return window.location.search.includes('debug=true');
    },

    /**
     * Configure les événements de debug
     */
    setupDebugEvents: function() {
        console.log('Mode Debug activé');

        // Logger tous les événements du jeu
        const events = [
            'game:start', 'game:end', 'game:pause', 'game:resume',
            'game:newOrder', 'game:orderComplete',
            'game:correctObject', 'game:wrongObject',
            'game:bonus', 'game:happening',
            'vr:enter', 'vr:exit', 'vr:click'
        ];

        events.forEach(eventName => {
            document.addEventListener(eventName, (e) => {
                console.log(`[DEBUG] ${eventName}:`, e.detail);
            });
        });
    },

    /**
     * Gère les appuis clavier
     * @param {KeyboardEvent} e - Événement clavier
     */
    handleKeyPress: function(e) {
        // Raccourcis de debug
        if (this.isDebugMode()) {
            switch (e.key) {
                case 'p':
                    // Pause/Resume
                    if (Game.state.isRunning) {
                        Game.state.isPaused ? Game.resume() : Game.pause();
                    }
                    break;
                case 'h':
                    // Déclencher un happening
                    Happenings.triggerRandomEvent();
                    break;
                case 'b':
                    // Spawner un bonus
                    Bonus.spawnRandomBonus();
                    break;
                case 't':
                    // Ajouter du temps
                    Game.state.timeRemaining += 30;
                    Game.updateUI();
                    break;
            }
        }

        // Touche Escape pour le menu
        if (e.key === 'Escape' && Game.state.isRunning) {
            Game.pause();
            // TODO: Afficher menu pause
        }
    }
};

// Démarrer l'application
App.init();

// Exporter pour debug
window.FeedTheBeasts = {
    App,
    Game,
    Camera,
    VRController,
    Audio,
    Monster,
    GameObject,
    Bonus,
    Happenings
};
