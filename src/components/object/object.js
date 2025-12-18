/**
 * Object.js - Gestion des objets cliquables dans le débarras
 * Spawn, interaction et animation des objets
 */

import { Game } from '../../core/Game.js';
import { Audio } from '../../core/Audio.js';

const GameObject = {
    // Container des objets
    container: null,
    
    // Liste des objets actuellement dans le jeu
    activeObjects: [],
    
    // Configuration
    config: {
        spawnArea: {
            minX: -4, maxX: 4,
            minY: 0.5, maxY: 2.5,
            minZ: -7, maxZ: -3
        },
        objectCount: 20
    },

    /**
     * Initialise le module Object
     */
    init: function() {
        console.log('[GameObject] Initialisation...');
        
        this.container = document.querySelector('#objects-container');
        
        this.setupEventListeners();
    },

    /**
     * Configure les écouteurs d'événements
     */
    setupEventListeners: function() {
        // Événement de clic sur un objet
        document.addEventListener('object:click', (e) => {
            if (e.detail.type === 'object') {
                this.onObjectClicked(e.detail.objectId, e.detail.element);
            }
        });

        // Début de partie - spawner les objets
        document.addEventListener('game:start', () => {
            this.spawnObjects();
        });

        // Objet correct - le déplacer vers le comptoir
        document.addEventListener('game:correctObject', (e) => {
            this.moveToCounter(e.detail.objectId);
        });

        // Nouvelle commande - repositionner les objets
        document.addEventListener('game:newOrder', () => {
            this.shufflePositions();
        });

        // Bonus: surbrillance
        document.addEventListener('game:bonus', (e) => {
            if (e.detail.type === 'highlight') {
                this.highlightOrderObjects();
            } else if (e.detail.type === 'enlarge') {
                this.enlargeOrderObjects();
            } else if (e.detail.type === 'hideWrong') {
                this.hideWrongObjects();
            }
        });
    },

    /**
     * Charge et spawn tous les objets
     */
    spawnObjects: async function() {
        // Nettoyer les objets existants
        this.clearObjects();

        // Charger les données des objets
        const objectsData = await this.loadObjectsData();

        // Spawner chaque objet
        objectsData.forEach((objData, index) => {
            this.spawnObject(objData, index);
        });
    },

    /**
     * Charge les données des objets depuis le JSON
     * @returns {Promise<Array>}
     */
    loadObjectsData: async function() {
        try {
            const response = await fetch('./src/data/json/objects.json');
            return await response.json();
        } catch (error) {
            console.error('[GameObject] Erreur chargement:', error);
            // Données de test
            return this.getDefaultObjects();
        }
    },

    /**
     * Retourne des objets par défaut pour le développement
     * @returns {Array}
     */
    getDefaultObjects: function() {
        return [
            { id: 'obj1', name: 'Pomme pourrie', color: '#8B0000' },
            { id: 'obj2', name: 'Chaussette usée', color: '#696969' },
            { id: 'obj3', name: 'Livre moisi', color: '#8B4513' },
            { id: 'obj4', name: 'Bougie fondue', color: '#FFFACD' },
            { id: 'obj5', name: 'Clé rouillée', color: '#B87333' },
            { id: 'obj6', name: 'Os rongé', color: '#F5F5DC' },
            { id: 'obj7', name: 'Potion suspecte', color: '#00FF00' },
            { id: 'obj8', name: 'Crâne poussiéreux', color: '#F0E68C' },
            { id: 'obj9', name: 'Plume magique', color: '#4169E1' },
            { id: 'obj10', name: 'Cristal brisé', color: '#E6E6FA' },
            { id: 'obj11', name: 'Champignon bizarre', color: '#FF6347' },
            { id: 'obj12', name: 'Fiole vide', color: '#87CEEB' },
            { id: 'obj13', name: 'Parchemin ancien', color: '#DEB887' },
            { id: 'obj14', name: 'Dent de dragon', color: '#FAFAD2' },
            { id: 'obj15', name: 'Amulette cassée', color: '#FFD700' },
            { id: 'obj16', name: 'Caillou brillant', color: '#C0C0C0' },
            { id: 'obj17', name: 'Fromage puant', color: '#FFFF00' },
            { id: 'obj18', name: 'Boue séchée', color: '#8B4513' },
            { id: 'obj19', name: 'Oeil de triton', color: '#32CD32' },
            { id: 'obj20', name: 'Chaîne rouillée', color: '#A0522D' }
        ];
    },

    /**
     * Spawn un objet individuel
     * @param {object} objData - Données de l'objet
     * @param {number} index - Index pour le positionnement
     */
    spawnObject: function(objData, index) {
        // Calculer une position aléatoire
        const position = this.getRandomPosition();

        // Créer l'entité A-Frame
        const entity = document.createElement('a-entity');
        entity.id = `object-${objData.id}`;
        entity.setAttribute('class', 'interactable');
        entity.setAttribute('clickable', `objectId: ${objData.id}; type: object`);
        entity.setAttribute('position', `${position.x} ${position.y} ${position.z}`);

        // Pour l'instant, utiliser des boîtes colorées
        // TODO: Remplacer par les modèles 3D
        entity.innerHTML = `
            <a-box 
                width="0.3" 
                height="0.3" 
                depth="0.3" 
                color="${objData.color || '#888888'}"
                class="interactable"
            ></a-box>
            <a-text 
                value="${objData.name}" 
                position="0 0.3 0" 
                align="center" 
                width="2"
                color="#ffffff"
                look-at="[camera]"
            ></a-text>
        `;

        // Stocker les données
        entity.dataset.objectId = objData.id;
        entity.dataset.objectName = objData.name;

        // Ajouter au container
        this.container.appendChild(entity);

        // Ajouter à la liste active
        this.activeObjects.push({
            id: objData.id,
            element: entity,
            data: objData,
            position: position
        });
    },

    /**
     * Génère une position aléatoire dans la zone de spawn
     * @returns {object} Position {x, y, z}
     */
    getRandomPosition: function() {
        const area = this.config.spawnArea;
        return {
            x: area.minX + Math.random() * (area.maxX - area.minX),
            y: area.minY + Math.random() * (area.maxY - area.minY),
            z: area.minZ + Math.random() * (area.maxZ - area.minZ)
        };
    },

    /**
     * Gère le clic sur un objet
     * @param {string} objectId - ID de l'objet cliqué
     * @param {Element} element - Élément DOM
     */
    onObjectClicked: function(objectId, element) {
        console.log('[GameObject] Clic sur:', objectId);
        
        // Jouer un son
        Audio.play('pickup');

        // Vérifier si l'objet est dans la commande
        Game.checkObject(objectId);
    },

    /**
     * Déplace un objet vers le comptoir
     * @param {string} objectId - ID de l'objet
     */
    moveToCounter: function(objectId) {
        const objData = this.activeObjects.find(obj => obj.id === objectId);
        if (!objData) return;

        const element = objData.element;
        const counterItems = document.querySelector('#counter-items');
        const itemCount = Game.state.collectedItems.length;

        // Position sur le comptoir
        const targetPos = {
            x: -1 + itemCount * 0.5,
            y: 0,
            z: 0
        };

        // Animation vers le comptoir
        element.setAttribute('animation', {
            property: 'position',
            to: `0 1.5 -8`,
            dur: 500,
            easing: 'easeInOutQuad'
        });

        // Après l'animation, déplacer dans le container du comptoir
        setTimeout(() => {
            element.setAttribute('position', `${targetPos.x} ${targetPos.y} ${targetPos.z}`);
            element.setAttribute('scale', '0.7 0.7 0.7');
            counterItems.appendChild(element);
        }, 500);

        // Retirer de la liste active
        this.activeObjects = this.activeObjects.filter(obj => obj.id !== objectId);
    },

    /**
     * Mélange les positions des objets
     */
    shufflePositions: function() {
        this.activeObjects.forEach(obj => {
            const newPos = this.getRandomPosition();
            obj.position = newPos;
            
            obj.element.setAttribute('animation', {
                property: 'position',
                to: `${newPos.x} ${newPos.y} ${newPos.z}`,
                dur: 800,
                easing: 'easeInOutQuad'
            });
        });
    },

    /**
     * Met en surbrillance les objets de la commande
     */
    highlightOrderObjects: function() {
        const orderIds = Game.state.currentOrder;
        
        this.activeObjects.forEach(obj => {
            if (orderIds.includes(obj.id)) {
                obj.element.querySelector('a-box').setAttribute('animation__glow', {
                    property: 'material.emissive',
                    from: '#000000',
                    to: '#FFFF00',
                    dur: 500,
                    dir: 'alternate',
                    loop: true
                });
            }
        });

        // Arrêter après 15 secondes
        setTimeout(() => {
            this.clearHighlight();
        }, 15000);
    },

    /**
     * Arrête la surbrillance
     */
    clearHighlight: function() {
        this.activeObjects.forEach(obj => {
            const box = obj.element.querySelector('a-box');
            if (box) {
                box.removeAttribute('animation__glow');
                box.setAttribute('material', 'emissive', '#000000');
            }
        });
    },

    /**
     * Agrandit les objets de la commande
     */
    enlargeOrderObjects: function() {
        const orderIds = Game.state.currentOrder;
        
        this.activeObjects.forEach(obj => {
            if (orderIds.includes(obj.id)) {
                obj.element.setAttribute('animation__scale', {
                    property: 'scale',
                    to: '1.5 1.5 1.5',
                    dur: 300
                });
            }
        });

        // Retour à la normale après 15 secondes
        setTimeout(() => {
            this.activeObjects.forEach(obj => {
                obj.element.setAttribute('scale', '1 1 1');
            });
        }, 15000);
    },

    /**
     * Cache les objets qui ne sont pas dans la commande
     */
    hideWrongObjects: function() {
        const orderIds = Game.state.currentOrder;
        
        this.activeObjects.forEach(obj => {
            if (!orderIds.includes(obj.id)) {
                obj.element.setAttribute('visible', 'false');
            }
        });

        // Réafficher après 15 secondes
        setTimeout(() => {
            this.activeObjects.forEach(obj => {
                obj.element.setAttribute('visible', 'true');
            });
        }, 15000);
    },

    /**
     * Supprime tous les objets
     */
    clearObjects: function() {
        if (this.container) {
            this.container.innerHTML = '';
        }
        this.activeObjects = [];
    }
};

export { GameObject };
