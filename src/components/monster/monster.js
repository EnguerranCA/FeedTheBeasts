/**
 * Monster.js - Gestion des monstres clients
 * Affichage, commandes et animations
 */

import { Game } from '../../core/Game.js';

const Monster = {
    // Monstre actuel
    current: null,
    
    // Flag pour éviter les spawns multiples
    isSpawning: false,
    
    // Container DOM
    container: null,
    speechBubble: null,
    requestText: null,

    // Liste des types de monstres (à compléter avec vos modèles)
    types: [
        { id: 'monster1', name: 'Gobelin Gourmand', color: '#4CAF50' },
        { id: 'monster2', name: 'Cyclope Affamé', color: '#9C27B0' },
        { id: 'monster3', name: 'Dragon Grignoteur', color: '#F44336' },
        { id: 'monster4', name: 'Blob Vorace', color: '#2196F3' },
        { id: 'monster5', name: 'Fantôme Famélique', color: '#607D8B' }
    ],

    /**
     * Initialise le module Monster
     */
    init: function() {
        console.log('[Monster] Initialisation...');
        
        // Attendre que A-Frame soit prêt
        const scene = document.querySelector('a-scene');
        if (scene.hasLoaded) {
            this.setupMonsterElements();
        } else {
            scene.addEventListener('loaded', () => {
                this.setupMonsterElements();
            });
        }

        // Écouter les événements du jeu
        this.setupEventListeners();
    },

    /**
     * Configure les éléments du monstre
     */
    setupMonsterElements: function() {
        this.container = document.querySelector('#current-monster');
        this.speechBubble = document.querySelector('#speech-bubble');
        this.requestText = document.querySelector('#monster-request');

        // Gérer les clics sur la bulle
        if (this.speechBubble) {
            this.speechBubble.addEventListener('click', () => {
                console.log('[Monster] Clic sur la bulle de dialogue !');
                this.onBubbleClick();
            });
        }
    },

    /**
     * Configure les écouteurs d'événements
     */
    setupEventListeners: function() {
        document.addEventListener('game:newOrder', (e) => {
            this.spawnNewMonster(e.detail);
        });

        document.addEventListener('game:orderComplete', () => {
            this.monsterLeaves();
        });

        document.addEventListener('game:correctObject', (e) => {
            this.reactToCorrectItem(e.detail.objectId);
        });

        document.addEventListener('game:wrongObject', () => {
            this.reactToWrongItem();
        });
    },

    /**
     * Fait apparaître un nouveau monstre
     * @param {object} orderData - Données de la commande
     */
    spawnNewMonster: async function(orderData) {
        // Éviter les appels multiples en parallèle
        if (this.isSpawning) {
            console.log('[Monster] Spawn déjà en cours, ignoré');
            return;
        }
        this.isSpawning = true;
        
        console.log('[Monster] spawnNewMonster appelé avec:', orderData);
        
        // Effacer le monstre précédent d'abord
        this.clearMonster();
        
        // Choisir un monstre aléatoire
        const monsterType = this.types[Math.floor(Math.random() * this.types.length)];
        
        // IMPORTANT : Créer this.current d'abord
        this.current = {
            ...monsterType,
            order: []
        };
        
        console.log('[Monster] Monstre actuel créé:', this.current);

        // Vérifier que le conteneur existe
        if (!this.container) {
            console.error('[Monster] Container non trouvé !');
            this.container = document.querySelector('#current-monster');
        }

        if (!this.container) {
            console.error('[Monster] Impossible de trouver #current-monster');
            return;
        }

        // Créer le nouveau monstre (placeholder - remplacer par votre modèle 3D)
        const monsterEntity = document.createElement('a-entity');
        monsterEntity.id = 'monster-model';
        
        // Pour l'instant, utiliser une forme simple
        monsterEntity.innerHTML = `
            <a-sphere radius="0.3" color="${monsterType.color}" position="0 0 0"></a-sphere>
            <a-sphere radius="0.1" color="#ffffff" position="-0.12 0.12 0.25">
                <a-sphere radius="0.05" color="#000000" position="0 0 0.05"></a-sphere>
            </a-sphere>
            <a-sphere radius="0.1" color="#ffffff" position="0.12 0.12 0.25">
                <a-sphere radius="0.05" color="#000000" position="0 0 0.05"></a-sphere>
            </a-sphere>
        `;

        // Animation d'entrée
        monsterEntity.setAttribute('position', '0 -0.5 0');
        monsterEntity.setAttribute('animation', {
            property: 'position',
            to: '0 0 0',
            dur: 500,
            easing: 'easeOutBack'
        });

        this.container.appendChild(monsterEntity);
        console.log('[Monster] Monstre ajouté au DOM');

        // Générer la commande
        await this.generateOrder(orderData.size);
        console.log('[Monster] Commande générée');
        
        // Réinitialiser le flag de spawn
        this.isSpawning = false;
    },

    /**
     * Génère une commande pour le monstre
     * @param {number} size - Nombre d'objets dans la commande
     */
    generateOrder: async function(size) {
        // Charger la liste des objets
        const objectsData = await this.loadObjectsData();
        
        if (!objectsData || objectsData.length === 0) {
            console.warn('[Monster] Pas d\'objets disponibles');
            return;
        }

        // Sélectionner des objets aléatoires
        const shuffled = [...objectsData].sort(() => Math.random() - 0.5);
        const order = shuffled.slice(0, Math.min(size, shuffled.length));

        this.current.order = order.map(obj => obj.id);

        // Mettre à jour l'état du jeu
        Game.state.currentOrder = this.current.order;

        // Afficher la bulle de dialogue
        this.showRequest(order);
    },

    /**
     * Charge les données des objets
     * @returns {Promise<Array>}
     */
    loadObjectsData: async function() {
        try {
            const response = await fetch('./src/data/json/objects.json');
            return await response.json();
        } catch (error) {
            console.error('[Monster] Erreur chargement objets:', error);
            // Retourner des objets par défaut pour le développement
            return [
                { id: 'obj1', name: 'Pomme pourrie' },
                { id: 'obj2', name: 'Chaussette usée' },
                { id: 'obj3', name: 'Livre moisi' },
                { id: 'obj4', name: 'Bougie fondue' },
                { id: 'obj5', name: 'Clé rouillée' }
            ];
        }
    },

    /**
     * Affiche la demande dans la bulle
     * @param {Array} items - Liste des objets demandés
     */
    showRequest: function(items) {
        console.log('[Monster] showRequest appelé avec:', items);
        console.log('[Monster] speechBubble:', this.speechBubble);
        console.log('[Monster] requestText:', this.requestText);
        
        if (!this.speechBubble || !this.requestText) {
            console.error('[Monster] Éléments manquants pour afficher la bulle');
            return;
        }

        const itemNames = items.map(item => item.name).join('\n- ');
        const requestText = `Je veux:\n- ${itemNames}`;
        console.log('[Monster] Texte de la demande:', requestText);
        
        this.requestText.setAttribute('value', requestText);
        this.speechBubble.setAttribute('visible', 'true');
        
        console.log('[Monster] Bulle affichée !');
        
        // Animation d'apparition
        this.speechBubble.setAttribute('animation', {
            property: 'scale',
            from: '0 0 0',
            to: '1 1 1',
            dur: 300,
            easing: 'easeOutBack'
        });
    },

    /**
     * Cache la bulle de dialogue
     */
    hideRequest: function() {
        if (this.speechBubble) {
            this.speechBubble.setAttribute('visible', 'false');
        }
    },

    /**
     * Réaction quand le joueur donne le bon objet
     * @param {string} objectId - ID de l'objet
     */
    reactToCorrectItem: function(objectId) {
        // Animation de joie
        const monster = document.querySelector('#monster-model');
        if (monster) {
            monster.setAttribute('animation__happy', {
                property: 'scale',
                from: '1 1 1',
                to: '1.2 1.2 1.2',
                dur: 200,
                dir: 'alternate',
                loop: 2
            });
        }

        // Mettre à jour la bulle (barrer l'objet)
        this.updateRequestDisplay();
    },

    /**
     * Réaction quand le joueur donne le mauvais objet
     */
    reactToWrongItem: function() {
        // Animation de mécontentement
        const monster = document.querySelector('#monster-model');
        if (monster) {
            monster.setAttribute('animation__shake', {
                property: 'rotation',
                from: '0 -20 0',
                to: '0 20 0',
                dur: 100,
                dir: 'alternate',
                loop: 4
            });
        }
    },

    /**
     * Met à jour l'affichage de la commande
     */
    updateRequestDisplay: function() {
        const remaining = this.current.order.filter(
            id => !Game.state.collectedItems.includes(id)
        );

        if (remaining.length === 0) {
            this.requestText.setAttribute('value', 'Merci !');
        }
    },

    /**
     * Le monstre part (commande complétée)
     */
    monsterLeaves: function() {
        const monster = document.querySelector('#monster-model');
        if (monster) {
            // Animation de sortie
            monster.setAttribute('animation__leave', {
                property: 'position',
                to: '0 3 0',
                dur: 500,
                easing: 'easeInBack'
            });

            setTimeout(() => {
                this.clearMonster();
            }, 500);
        }

        this.hideRequest();
    },

    /**
     * Supprime le monstre actuel
     */
    clearMonster: function() {
        // Vider complètement le container du monstre
        if (this.container) {
            this.container.innerHTML = '';
        } else {
            // Fallback: supprimer tous les monstres par ID
            const oldMonsters = document.querySelectorAll('#monster-model');
            oldMonsters.forEach(monster => monster.remove());
        }
        // NE PAS mettre this.current à null ici car on vient de le créer
        // this.current = null;
    },

    /**
     * Gère le clic sur la bulle de dialogue
     */
    onBubbleClick: function() {
        // Effet visuel de clic
        if (this.speechBubble) {
            this.speechBubble.setAttribute('animation__click', {
                property: 'scale',
                from: '1 1 1',
                to: '1.1 1.1 1.1',
                dur: 150,
                dir: 'alternate',
                loop: 1
            });
        }

        // Émettre un événement pour indiquer que le joueur a lu la demande
        document.dispatchEvent(new CustomEvent('monster:requestRead', {
            detail: {
                order: this.current ? this.current.order : []
            }
        }));
    }
};

export { Monster };
