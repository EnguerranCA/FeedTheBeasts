/**
 * Object.js - Gestion des objets cliquables dans le débarras
 * Spawn, interaction et animation des objets
 */

import { Game } from '../../core/Game.js';
import { playSound } from '../../utils/playSound.js';

const GameObject = {
    // Container des objets
    container: null,

    // Liste des objets actuellement dans le jeu
    activeObjects: [],

    // Configuration
    config: {
        objectCount: 7,
        // Liste des positions prédéfinies pour les objets (autour du joueur, évitant la zone du monstre)
        positions: [
            // Mur gauche (X négatif)
            { x: -2.139, y: 0.412 , z: -1.035 },
            { x: -0.3, y: 0.412 , z: -1.035 },
            { x: 1.532, y: 0.412, z: -1.035 },
            { x: 3.309, y: 0.412, z: -1.035 },
            { x: -3.942, y: 0.325, z: 4.370 },
            { x: -2.473, y: 0.024, z: 4.520 },
            { x: 3.500, y: -0.287, z: 2.608 },

        ]
    },

    /**
     * Initialise le module Object
     */
    init: function () {
        console.log('[GameObject] Initialisation...');

        this.container = document.querySelector('#objects-container');

        this.setupEventListeners();
    },

    /**
     * Configure les écouteurs d'événements
     */
    setupEventListeners: function () {
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
            this.resetObjectsForNewOrder();
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
    spawnObjects: async function () {
        // Nettoyer les objets existants
        this.clearObjects();

        // Mélanger les positions au début de la partie
        this.shuffleAllPositions();

        // Charger les données des objets
        const allObjectsData = await this.loadObjectsData();
        
        // Sélectionner 7 objets aléatoires pour cette partie
        const shuffledObjects = [...allObjectsData].sort(() => Math.random() - 0.5);
        const objectsData = shuffledObjects.slice(0, this.config.objectCount);
        
        console.log('[GameObject] Objets sélectionnés pour cette partie:', objectsData.map(o => o.name));

        // Spawner chaque objet
        objectsData.forEach((objData, index) => {
            this.spawnObject(objData, index);
        });
    },

    /**
     * Charge les données des objets depuis le JSON
     * @returns {Promise<Array>}
     */
    loadObjectsData: async function () {
        try {
            const response = await fetch('/assets/data/objects-3d.json');
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
    getDefaultObjects: function () {
        return [
            { id: 'obj1', name: 'Baby Chick', label: 'Poussin', path: '/assets/tofind/Baby chick.glb', scale: 0.5 },
            { id: 'obj2', name: 'Baseball', label: 'Baseball', path: '/assets/tofind/Baseball.glb', scale: 0.3 },
            { id: 'obj3', name: 'Basketball', label: 'Basketball', path: '/assets/tofind/Basketball.glb', scale: 0.4 },
            { id: 'obj4', name: 'Broom', label: 'Balai', path: '/assets/tofind/Broom.glb', scale: 0.6 },
            { id: 'obj5', name: 'Bus', label: 'Bus', path: '/assets/tofind/Bus.glb', scale: 0.5 },
            { id: 'obj6', name: 'Crab', label: 'Crabe', path: '/assets/tofind/Crab.glb', scale: 0.4 },
            { id: 'obj7', name: 'Diamond Block', label: 'Bloc de Diamant', path: '/assets/tofind/Diamond Block.glb', scale: 0.3 },
            { id: 'obj8', name: 'Egg', label: 'Œuf', path: '/assets/tofind/Egg.glb', scale: 0.3 },
            { id: 'obj9', name: 'Great Horned Owl', label: 'Hibou', path: '/assets/tofind/Great horned owl.glb', scale: 0.5 },
            { id: 'obj10', name: 'Moon', label: 'Lune', path: '/assets/tofind/Moon.glb', scale: 0.4 },
            { id: 'obj11', name: 'Soccer Football', label: 'Ballon de Foot', path: '/assets/tofind/Simple soccer football.glb', scale: 0.3 },
            { id: 'obj12', name: 'Snowman', label: 'Bonhomme de Neige', path: '/assets/tofind/Snowman.glb', scale: 0.5 },
            { id: 'obj13', name: 'Spider', label: 'Araignée', path: '/assets/tofind/Spider.glb', scale: 0.4 },
            { id: 'obj14', name: 'T-Rex', label: 'T-Rex', path: '/assets/tofind/T-Rex.glb', scale: 0.5 },
            { id: 'obj15', name: 'Table Tennis Paddle', label: 'Raquette de Ping-Pong', path: '/assets/tofind/Table Tennis Paddle.glb', scale: 0.4 },
            { id: 'obj16', name: 'Taco', label: 'Taco', path: '/assets/tofind/Taco.glb', scale: 0.3 },
            { id: 'obj17', name: 'Tambourine', label: 'Tambourin', path: '/assets/tofind/Tambourine.glb', scale: 0.4 },
            { id: 'obj18', name: 'Tennis Ball', label: 'Balle de Tennis', path: '/assets/tofind/Tennis ball.glb', scale: 0.2 },
            { id: 'obj19', name: 'Toy Mouse', label: 'Souris Jouet', path: '/assets/tofind/Toy Mouse.glb', scale: 0.3 }
        ];
    },

    /**
     * Spawn un objet individuel
     * @param {object} objData - Données de l'objet
     * @param {number} index - Index pour le positionnement
     */
    spawnObject: function (objData, index) {
        // Calculer une position aléatoire
        const position = this.getRandomPosition();

        // Créer l'entité A-Frame
        const entity = document.createElement('a-entity');
        entity.id = `object-${objData.id}`;
        entity.setAttribute('class', 'interactable');
        entity.setAttribute('clickable', `objectId: ${objData.id}; type: object`);
        entity.setAttribute('position', `${position.x} ${position.y} ${position.z}`);

        // Utiliser le modèle 3D GLB
        const scale = objData.scale || 0.3;

        // Appliquer le scale sur l'entité parente pour que le hover fonctionne correctement
        entity.setAttribute('scale', `${scale} ${scale} ${scale}`);

        entity.innerHTML = `
            <a-entity 
                gltf-model="${objData.path}"
                class="interactable clickable"
            ></a-entity>
        `;

        // Stocker les données et le scale original
        entity.dataset.objectId = objData.id;
        entity.dataset.objectName = objData.name;
        entity.dataset.objectLabel = objData.label;
        entity.setAttribute('data-original-scale', `${scale} ${scale} ${scale}`);

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
     * Génère une position aléatoire autour du joueur (360°) en évitant la zone du monstre
     * @returns {object} Position {x, y, z}
     */
    // Index pour la position suivante (après mélange)
    positionIndex: 0,
    shuffledPositions: [],

    /**
     * Mélange les positions au début de chaque partie
     */
    shuffleAllPositions: function () {
        // Créer une copie et mélanger
        this.shuffledPositions = [...this.config.positions].sort(() => Math.random() - 0.5);
        this.positionIndex = 0;
    },

    /**
     * Obtient la prochaine position de la liste mélangée
     * @returns {object} Position {x, y, z}
     */
    getNextPosition: function () {
        if (this.shuffledPositions.length === 0 || this.positionIndex >= this.shuffledPositions.length) {
            // Si on n'a pas encore mélangé ou si on a utilisé toutes les positions
            this.shuffleAllPositions();
        }
        return this.shuffledPositions[this.positionIndex++];
    },

    /**
     * Retourne une position pour un objet (utilise les positions prédéfinies)
     * @returns {object} Position {x, y, z}
     */
    getRandomPosition: function () {
        return this.getNextPosition();
    },

    /**
     * Gère le clic sur un objet
     * @param {string} objectId - ID de l'objet cliqué
     * @param {Element} element - Élément DOM
     */
    onObjectClicked: function (objectId, element) {
        console.log('[GameObject] Clic sur:', objectId);

        // Jouer un son de clic
        playSound('click', 0.4);

        // Vérifier si l'objet est dans la commande
        Game.checkObject(objectId);
    },

    /**
     * Déplace un objet vers le comptoir
     * @param {string} objectId - ID de l'objet
     */
    moveToCounter: function (objectId) {
        const objData = this.activeObjects.find(obj => obj.id === objectId);
        if (!objData) return;

        const element = objData.element;
        const counterItems = document.querySelector('#counter-items');
        const itemCount = Game.state.collectedItems.length;

        // Position relative sur le comptoir
        const targetPos = {
            x: -0.5 + itemCount * 0.25,
            y: 0,
            z: 0
        };

        // Animation vers le comptoir (position absolue temporaire)
        element.setAttribute('animation', {
            property: 'position',
            to: `0 1.5 0`,
            dur: 500,
            easing: 'easeInOutQuad'
        });

        // Après l'animation, déplacer dans le container du comptoir
        setTimeout(() => {
            // Déplacer dans le container du comptoir
            counterItems.appendChild(element);

            // Position relative dans le container
            element.setAttribute('position', `${targetPos.x} ${targetPos.y} ${targetPos.z}`);

            // Réduire la taille pour le comptoir (mais sauvegarder l'original)
            element.setAttribute('scale', '0.7 0.7 0.7');
        }, 500);

        // Retirer de la liste active
        this.activeObjects = this.activeObjects.filter(obj => obj.id !== objectId);
    },

    /**
     * Mélange les positions des objets
     */
    shufflePositions: function () {
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
     * Réinitialise les objets pour une nouvelle commande
     * Récupère les objets du comptoir et les remet dans le jeu
     */
    resetObjectsForNewOrder: function () {
        // Récupérer les objets qui sont sur le comptoir
        const counterItems = document.querySelector('#counter-items');
        if (counterItems) {
            const collectedObjects = Array.from(counterItems.children);

            collectedObjects.forEach(element => {
                // Restaurer le scale original
                const originalScale = element.getAttribute('data-original-scale');
                if (originalScale) {
                    element.setAttribute('scale', originalScale);
                }

                // Remettre l'objet dans le container principal
                this.container.appendChild(element);

                // Récupérer les données de l'objet
                const objectId = element.dataset.objectId;
                const objectData = element.dataset;

                // Ajouter à la liste active si pas déjà présent
                if (!this.activeObjects.find(obj => obj.id === objectId)) {
                    this.activeObjects.push({
                        id: objectId,
                        element: element,
                        data: {
                            id: objectId,
                            name: objectData.objectName,
                            label: objectData.objectLabel,
                            scale: parseFloat(originalScale.split(' ')[0])
                        },
                        position: { x: 0, y: 0, z: 0 } // Sera mis à jour ci-dessous
                    });
                }
            });
        }

        // Maintenant mélanger les positions de TOUS les objets
        this.shufflePositions();
    },

    /**
     * Met en surbrillance les objets de la commande
     */
    highlightOrderObjects: function () {
        const orderIds = Game.state.currentOrder;

        this.activeObjects.forEach(obj => {
            if (orderIds.includes(obj.id)) {
                // Récupérer le scale original de l'entité parente
                const originalScale = obj.element.getAttribute('data-original-scale');
                const scaleValue = parseFloat(originalScale.split(' ')[0]);
                const targetScale = scaleValue * 1.3;

                obj.element.setAttribute('animation__glow', {
                    property: 'scale',
                    from: `${scaleValue} ${scaleValue} ${scaleValue}`,
                    to: `${targetScale} ${targetScale} ${targetScale}`,
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
    clearHighlight: function () {
        this.activeObjects.forEach(obj => {
            obj.element.removeAttribute('animation__glow');
            // Restaurer le scale original
            const originalScale = obj.element.getAttribute('data-original-scale');
            if (originalScale) {
                obj.element.setAttribute('scale', originalScale);
            }
        });
    },

    /**
     * Agrandit les objets de la commande
     */
    enlargeOrderObjects: function () {
        const orderIds = Game.state.currentOrder;

        this.activeObjects.forEach(obj => {
            if (orderIds.includes(obj.id)) {
                // Récupérer le scale original et l'agrandir de 50%
                const originalScale = obj.element.getAttribute('data-original-scale');
                const scaleValue = parseFloat(originalScale.split(' ')[0]);
                const targetScale = scaleValue * 1.5;

                obj.element.setAttribute('animation__scale', {
                    property: 'scale',
                    to: `${targetScale} ${targetScale} ${targetScale}`,
                    dur: 300
                });
            }
        });

        // Retour à la normale après 15 secondes
        setTimeout(() => {
            this.activeObjects.forEach(obj => {
                const originalScale = obj.element.getAttribute('data-original-scale');
                if (originalScale) {
                    obj.element.setAttribute('scale', originalScale);
                }
            });
        }, 15000);
    },

    /**
     * Cache les objets qui ne sont pas dans la commande
     */
    hideWrongObjects: function () {
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
    clearObjects: function () {
        if (this.container) {
            this.container.innerHTML = '';
        }
        this.activeObjects = [];
    }
};

export { GameObject };
