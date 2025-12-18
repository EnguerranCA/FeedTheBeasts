/**
 * Happenings.js - Événements aléatoires pendant le jeu
 * Lumière qui s'éteint, objets qui bougent, vision en noir et blanc, etc.
 */

import { Game } from '../../core/Game.js';
import { Audio } from '../../core/Audio.js';
import { Camera } from '../../core/Camera.js';

const Happenings = {
    // Liste des événements possibles
    events: [
        {
            id: 'lightsOff',
            name: 'Panne de courant',
            description: 'Les lumières s\'éteignent pendant quelques secondes',
            duration: 5000
        },
        {
            id: 'objectsShuffle',
            name: 'Tremblement',
            description: 'Les objets changent de place',
            duration: 0
        },
        {
            id: 'blackAndWhite',
            name: 'Vision trouble',
            description: 'La vision passe en noir et blanc',
            duration: 8000
        },
        {
            id: 'fog',
            name: 'Brouillard',
            description: 'Du brouillard envahit la pièce',
            duration: 10000
        },
        {
            id: 'earthquake',
            name: 'Secousse',
            description: 'La pièce tremble',
            duration: 3000
        }
    ],

    // État actuel
    activeEvent: null,

    /**
     * Initialise le module Happenings
     */
    init: function() {
        console.log('[Happenings] Initialisation...');
        
        this.setupEventListeners();
    },

    /**
     * Configure les écouteurs d'événements
     */
    setupEventListeners: function() {
        document.addEventListener('game:happening', () => {
            this.triggerRandomEvent();
        });

        document.addEventListener('game:end', () => {
            this.clearActiveEvent();
        });
    },

    /**
     * Déclenche un événement aléatoire
     */
    triggerRandomEvent: function() {
        if (this.activeEvent) return; // Un événement est déjà en cours

        const event = this.events[Math.floor(Math.random() * this.events.length)];
        this.triggerEvent(event);
    },

    /**
     * Déclenche un événement spécifique
     * @param {object} event - Événement à déclencher
     */
    triggerEvent: function(event) {
        console.log('[Happenings] Événement:', event.name);
        this.activeEvent = event;

        // Émettre l'événement
        document.dispatchEvent(new CustomEvent('happening:start', { detail: event }));

        // Exécuter l'effet
        switch (event.id) {
            case 'lightsOff':
                this.lightsOff(event.duration);
                break;
            case 'objectsShuffle':
                this.objectsShuffle();
                break;
            case 'blackAndWhite':
                this.blackAndWhite(event.duration);
                break;
            case 'fog':
                this.fog(event.duration);
                break;
            case 'earthquake':
                this.earthquake(event.duration);
                break;
        }

        // Fin de l'événement
        if (event.duration > 0) {
            setTimeout(() => {
                this.endEvent(event);
            }, event.duration);
        } else {
            this.activeEvent = null;
        }
    },

    /**
     * Fin d'un événement
     * @param {object} event - Événement terminé
     */
    endEvent: function(event) {
        console.log('[Happenings] Fin de:', event.name);
        this.activeEvent = null;
        document.dispatchEvent(new CustomEvent('happening:end', { detail: event }));
    },

    /**
     * Effet: Lumières éteintes
     * @param {number} duration - Durée en ms
     */
    lightsOff: function(duration) {
        Audio.play('lightsOff');

        // Baisser l'intensité des lumières
        const ambientLight = document.querySelector('a-light[type="ambient"]');
        const directionalLight = document.querySelector('a-light[type="directional"]');

        if (ambientLight) {
            ambientLight.setAttribute('intensity', '0.05');
        }
        if (directionalLight) {
            directionalLight.setAttribute('intensity', '0.1');
        }

        // Restaurer après la durée
        setTimeout(() => {
            if (ambientLight) {
                ambientLight.setAttribute('intensity', '0.4');
            }
            if (directionalLight) {
                directionalLight.setAttribute('intensity', '0.6');
            }
        }, duration);
    },

    /**
     * Effet: Mélange des objets
     */
    objectsShuffle: function() {
        // L'événement sera capté par le module GameObject
        document.dispatchEvent(new CustomEvent('game:newOrder', { 
            detail: { shuffle: true } 
        }));
    },

    /**
     * Effet: Vision noir et blanc
     * @param {number} duration - Durée en ms
     */
    blackAndWhite: function(duration) {
        const scene = document.querySelector('a-scene');
        
        // Appliquer un effet de post-processing (via CSS filter sur le canvas)
        const canvas = scene.canvas;
        if (canvas) {
            canvas.style.filter = 'grayscale(100%)';
            
            setTimeout(() => {
                canvas.style.filter = '';
            }, duration);
        }
    },

    /**
     * Effet: Brouillard
     * @param {number} duration - Durée en ms
     */
    fog: function(duration) {
        const scene = document.querySelector('a-scene');
        
        // Activer le brouillard A-Frame
        scene.setAttribute('fog', {
            type: 'exponential',
            color: '#aaaaaa',
            density: 0.1
        });

        setTimeout(() => {
            scene.removeAttribute('fog');
        }, duration);
    },

    /**
     * Effet: Tremblement de terre
     * @param {number} duration - Durée en ms
     */
    earthquake: function(duration) {
        Camera.shake(0.15, duration);
        
        // Secouer aussi les objets
        const objects = document.querySelectorAll('#objects-container > a-entity');
        objects.forEach(obj => {
            const currentPos = obj.getAttribute('position');
            obj.setAttribute('animation__shake', {
                property: 'position',
                from: `${currentPos.x - 0.1} ${currentPos.y} ${currentPos.z}`,
                to: `${currentPos.x + 0.1} ${currentPos.y} ${currentPos.z}`,
                dur: 50,
                dir: 'alternate',
                loop: Math.floor(duration / 100)
            });
        });
    },

    /**
     * Arrête l'événement actif
     */
    clearActiveEvent: function() {
        if (this.activeEvent) {
            this.endEvent(this.activeEvent);
        }

        // Restaurer les paramètres normaux
        const ambientLight = document.querySelector('a-light[type="ambient"]');
        const directionalLight = document.querySelector('a-light[type="directional"]');
        const scene = document.querySelector('a-scene');

        if (ambientLight) ambientLight.setAttribute('intensity', '0.4');
        if (directionalLight) directionalLight.setAttribute('intensity', '0.6');
        if (scene) {
            scene.removeAttribute('fog');
            if (scene.canvas) scene.canvas.style.filter = '';
        }
    }
};

export { Happenings };
