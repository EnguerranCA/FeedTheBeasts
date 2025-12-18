/**
 * Bonus.js - Gestion des bonus (vifs d'or)
 * Spawn aléatoire et effets des bonus
 */

import { Game } from '../../core/Game.js';
import { Audio } from '../../core/Audio.js';

const Bonus = {
    // Container des bonus
    container: null,
    
    // Bonus actifs
    activeBonus: [],
    
    // Intervalle de spawn
    spawnInterval: null,

    // Types de bonus
    types: [
        {
            id: 'highlight',
            name: 'Surbrillance',
            description: 'Les objets à prendre brillent pendant 15s',
            color: '#FFFF00',
            duration: 15000
        },
        {
            id: 'enlarge',
            name: 'Agrandissement',
            description: 'Les objets à prendre grossissent pendant 15s',
            color: '#00FF00',
            duration: 15000
        },
        {
            id: 'hideWrong',
            name: 'Invisibilité',
            description: 'Les mauvais objets disparaissent pendant 15s',
            color: '#0000FF',
            duration: 15000
        },
        {
            id: 'timeBonus',
            name: 'Temps bonus',
            description: '+30 secondes au timer',
            color: '#FF00FF',
            duration: 0
        },
        {
            id: 'doublePoints',
            name: 'Double points',
            description: 'Points doublés pendant 20s',
            color: '#FFA500',
            duration: 20000
        }
    ],

    /**
     * Initialise le module Bonus
     */
    init: function() {
        console.log('[Bonus] Initialisation...');
        
        this.container = document.querySelector('#bonus-container');
        
        this.setupEventListeners();
    },

    /**
     * Configure les écouteurs d'événements
     */
    setupEventListeners: function() {
        // Début de partie
        document.addEventListener('game:start', () => {
            this.startSpawning();
        });

        // Fin de partie
        document.addEventListener('game:end', () => {
            this.stopSpawning();
            this.clearBonus();
        });

        // Clic sur un bonus
        document.addEventListener('object:click', (e) => {
            if (e.detail.type === 'bonus') {
                this.collectBonus(e.detail.objectId);
            }
        });
    },

    /**
     * Démarre le spawn périodique de bonus
     */
    startSpawning: function() {
        // Spawn rate basé sur la difficulté
        const spawnRate = Game.config[Game.state.difficulty].bonusSpawnRate;
        const interval = 10000; // Vérifier toutes les 10 secondes

        this.spawnInterval = setInterval(() => {
            if (Math.random() < spawnRate) {
                this.spawnRandomBonus();
            }
        }, interval);
    },

    /**
     * Arrête le spawn de bonus
     */
    stopSpawning: function() {
        if (this.spawnInterval) {
            clearInterval(this.spawnInterval);
            this.spawnInterval = null;
        }
    },

    /**
     * Spawn un bonus aléatoire
     */
    spawnRandomBonus: function() {
        const bonusType = this.types[Math.floor(Math.random() * this.types.length)];
        this.spawnBonus(bonusType);
    },

    /**
     * Spawn un bonus spécifique
     * @param {object} bonusType - Type de bonus à spawner
     */
    spawnBonus: function(bonusType) {
        // Position aléatoire (en l'air, mobile)
        const position = {
            x: -3 + Math.random() * 6,
            y: 1.5 + Math.random() * 1.5,
            z: -6 + Math.random() * 4
        };

        // Créer l'entité
        const entity = document.createElement('a-entity');
        entity.id = `bonus-${bonusType.id}-${Date.now()}`;
        entity.setAttribute('class', 'interactable');
        entity.setAttribute('clickable', `objectId: ${entity.id}; type: bonus`);
        entity.setAttribute('position', `${position.x} ${position.y} ${position.z}`);

        // Apparence (petite sphère dorée qui bouge)
        entity.innerHTML = `
            <a-sphere 
                radius="0.15" 
                color="${bonusType.color}"
                metalness="0.8"
                roughness="0.2"
                class="interactable"
            ></a-sphere>
        `;

        // Animation de flottement
        entity.setAttribute('animation__float', {
            property: 'position',
            from: `${position.x} ${position.y} ${position.z}`,
            to: `${position.x} ${position.y + 0.3} ${position.z}`,
            dur: 1000,
            dir: 'alternate',
            loop: true,
            easing: 'easeInOutSine'
        });

        // Animation de rotation
        entity.setAttribute('animation__spin', {
            property: 'rotation',
            from: '0 0 0',
            to: '0 360 0',
            dur: 2000,
            loop: true,
            easing: 'linear'
        });

        // Mouvement aléatoire
        this.addRandomMovement(entity);

        // Stocker les données
        entity.dataset.bonusId = entity.id;
        entity.dataset.bonusType = bonusType.id;

        // Ajouter au container
        this.container.appendChild(entity);
        
        this.activeBonus.push({
            id: entity.id,
            type: bonusType,
            element: entity
        });

        // Auto-destruction après 15 secondes
        setTimeout(() => {
            this.removeBonus(entity.id);
        }, 15000);
    },

    /**
     * Ajoute un mouvement aléatoire au bonus
     * @param {Element} entity - Élément bonus
     */
    addRandomMovement: function(entity) {
        let direction = { x: Math.random() - 0.5, z: Math.random() - 0.5 };
        const speed = 0.02;

        const move = () => {
            if (!entity.parentNode) return; // Arrêter si supprimé

            const pos = entity.getAttribute('position');
            let newX = pos.x + direction.x * speed;
            let newZ = pos.z + direction.z * speed;

            // Rebondir sur les bords
            if (newX < -4 || newX > 4) direction.x *= -1;
            if (newZ < -7 || newZ > -2) direction.z *= -1;

            entity.setAttribute('position', `${newX} ${pos.y} ${newZ}`);
            requestAnimationFrame(move);
        };

        requestAnimationFrame(move);
    },

    /**
     * Collecte un bonus
     * @param {string} bonusId - ID du bonus
     */
    collectBonus: function(bonusId) {
        const bonus = this.activeBonus.find(b => b.id === bonusId);
        if (!bonus) return;

        console.log('[Bonus] Collecté:', bonus.type.name);

        // Jouer le son
        Audio.play('bonus');

        // Appliquer l'effet
        this.applyBonusEffect(bonus.type);

        // Animation de collecte
        bonus.element.setAttribute('animation__collect', {
            property: 'scale',
            to: '0 0 0',
            dur: 300,
            easing: 'easeInBack'
        });

        // Supprimer après animation
        setTimeout(() => {
            this.removeBonus(bonusId);
        }, 300);
    },

    /**
     * Applique l'effet d'un bonus
     * @param {object} bonusType - Type de bonus
     */
    applyBonusEffect: function(bonusType) {
        switch (bonusType.id) {
            case 'highlight':
            case 'enlarge':
            case 'hideWrong':
                // Ces bonus sont gérés par le module GameObject
                Game.activateBonus(bonusType.id);
                break;

            case 'timeBonus':
                // Ajouter du temps
                Game.state.timeRemaining += 30;
                Game.updateUI();
                break;

            case 'doublePoints':
                // Double points temporaire
                Game.state.doublePoints = true;
                setTimeout(() => {
                    Game.state.doublePoints = false;
                }, bonusType.duration);
                break;
        }

        // Émettre l'événement
        const event = new CustomEvent('bonus:activated', {
            detail: { type: bonusType.id, duration: bonusType.duration }
        });
        document.dispatchEvent(event);
    },

    /**
     * Supprime un bonus
     * @param {string} bonusId - ID du bonus
     */
    removeBonus: function(bonusId) {
        const index = this.activeBonus.findIndex(b => b.id === bonusId);
        if (index === -1) return;

        const bonus = this.activeBonus[index];
        if (bonus.element && bonus.element.parentNode) {
            bonus.element.remove();
        }

        this.activeBonus.splice(index, 1);
    },

    /**
     * Supprime tous les bonus
     */
    clearBonus: function() {
        this.activeBonus.forEach(bonus => {
            if (bonus.element && bonus.element.parentNode) {
                bonus.element.remove();
            }
        });
        this.activeBonus = [];
    }
};

export { Bonus };
