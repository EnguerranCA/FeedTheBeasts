/**
 * VRController.js - Gestion des manettes VR et interactions
 * Supporte Quest, Vive, WMR et mode Desktop (souris)
 */

const VRController = {
    // Références aux contrôleurs
    rightController: null,
    leftController: null,
    isVRMode: false,
    
    // Raycaster pour le desktop
    raycaster: null,
    mouse: null,
    camera: null,

    /**
     * Initialise les contrôleurs VR
     */
    init: function() {
        console.log('[VRController] Initialisation...');
        
        this.rightController = document.querySelector('#right-controller');
        this.leftController = document.querySelector('#left-controller');

        // Détecter le mode VR
        this.setupVRDetection();
        
        // Setup des interactions
        this.setupControllerInteractions();
        this.setupDesktopRaycaster();
        
        // Enregistrer le composant A-Frame pour les objets cliquables
        this.registerClickableComponent();
    },

    /**
     * Détecte si on est en mode VR
     */
    setupVRDetection: function() {
        const scene = document.querySelector('a-scene');
        
        scene.addEventListener('enter-vr', () => {
            console.log('[VRController] Entrée en mode VR');
            this.isVRMode = true;
            this.emit('vr:enter');
        });

        scene.addEventListener('exit-vr', () => {
            console.log('[VRController] Sortie du mode VR');
            this.isVRMode = false;
            this.emit('vr:exit');
        });
    },

    /**
     * Configure les interactions des manettes VR
     */
    setupControllerInteractions: function() {
        // Manette droite - trigger pour cliquer
        if (this.rightController) {
            this.rightController.addEventListener('triggerdown', (evt) => {
                this.handleVRClick(this.rightController);
            });

            this.rightController.addEventListener('gripdown', (evt) => {
                this.handleVRGrip(this.rightController, true);
            });

            this.rightController.addEventListener('gripup', (evt) => {
                this.handleVRGrip(this.rightController, false);
            });
        }

        // Manette gauche - trigger pour cliquer
        if (this.leftController) {
            this.leftController.addEventListener('triggerdown', (evt) => {
                this.handleVRClick(this.leftController);
            });
        }
    },

    /**
     * Gère un clic VR
     * @param {Element} controller - Le contrôleur qui a déclenché l'action
     */
    handleVRClick: function(controller) {
        const raycaster = controller.components.raycaster;
        if (!raycaster) return;

        const intersectedEls = raycaster.intersectedEls;
        if (intersectedEls.length > 0) {
            const target = intersectedEls[0];
            console.log('[VRController] Clic VR sur:', target.id || target.tagName);
            
            // Déclencher un événement click sur l'élément
            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true
            });
            target.dispatchEvent(clickEvent);

            // Émettre un événement personnalisé
            this.emit('vr:click', { target, controller });
        }
    },

    /**
     * Gère l'action grip (saisir)
     * @param {Element} controller - Le contrôleur
     * @param {boolean} isGripping - État du grip
     */
    handleVRGrip: function(controller, isGripping) {
        if (isGripping) {
            const raycaster = controller.components.raycaster;
            if (!raycaster) return;

            const intersectedEls = raycaster.intersectedEls;
            if (intersectedEls.length > 0) {
                const target = intersectedEls[0];
                if (target.classList.contains('grabbable')) {
                    this.emit('vr:grab', { target, controller });
                }
            }
        } else {
            this.emit('vr:release', { controller });
        }
    },

    /**
     * Configure les interactions desktop avec Three.js Raycaster
     */
    setupDesktopRaycaster: function() {
        const scene = document.querySelector('a-scene');
        
        // Attendre que la scène soit chargée
        if (scene.hasLoaded) {
            this.initThreeRaycaster(scene);
        } else {
            scene.addEventListener('loaded', () => {
                this.initThreeRaycaster(scene);
            });
        }
    },

    /**
     * Initialise le raycaster Three.js
     * @param {Element} scene - La scène A-Frame
     */
    initThreeRaycaster: function(scene) {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        // Récupérer la caméra Three.js
        const cameraEl = document.querySelector('[camera]');
        if (cameraEl && cameraEl.object3D) {
            // La caméra est dans l'objet3D
            this.camera = cameraEl.getObject3D('camera') || cameraEl.object3D.children.find(c => c.isCamera);
        }

        // Événement click
        scene.canvas.addEventListener('click', (event) => {
            if (!this.isVRMode) {
                this.handleDesktopClick(event, scene);
            }
        });

        // Événement mousemove pour le hover
        scene.canvas.addEventListener('mousemove', (event) => {
            if (!this.isVRMode) {
                this.handleDesktopHover(event, scene);
            }
        });

        console.log('[VRController] Raycaster desktop initialisé');
    },

    /**
     * Gère le clic desktop avec raycasting
     * @param {MouseEvent} event - Événement souris
     * @param {Element} scene - La scène A-Frame
     */
    handleDesktopClick: function(event, scene) {
        // Calculer la position de la souris normalisée
        const rect = scene.canvas.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        // Mettre à jour la caméra si nécessaire
        if (!this.camera) {
            const cameraEl = document.querySelector('[camera]');
            if (cameraEl) {
                this.camera = cameraEl.getObject3D('camera') || cameraEl.object3D.children.find(c => c.isCamera);
            }
        }

        if (!this.camera) {
            console.warn('[VRController] Caméra non trouvée');
            return;
        }

        // Effectuer le raycast
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Récupérer tous les objets interactables
        const interactables = this.getInteractableObjects(scene);
        const intersects = this.raycaster.intersectObjects(interactables, true);

        if (intersects.length > 0) {
            // Trouver l'élément A-Frame parent
            let target = intersects[0].object;
            let aframeEl = this.findAFrameElement(target);
            
            if (aframeEl) {
                console.log('[VRController] Clic sur:', aframeEl.id || aframeEl.tagName);
                
                // Déclencher l'événement click
                aframeEl.emit('click', { intersection: intersects[0] });
                
                // Si l'élément a un composant clickable, déclencher l'événement personnalisé
                if (aframeEl.hasAttribute('clickable')) {
                    const clickableData = aframeEl.getAttribute('clickable');
                    const event = new CustomEvent('object:click', {
                        detail: {
                            element: aframeEl,
                            objectId: clickableData.objectId,
                            type: clickableData.type,
                            intersection: intersects[0]
                        }
                    });
                    document.dispatchEvent(event);
                }

                this.emit('desktop:click', { target: aframeEl, intersection: intersects[0] });
            }
        }
    },

    /**
     * Gère le hover desktop avec raycasting
     * @param {MouseEvent} event - Événement souris
     * @param {Element} scene - La scène A-Frame
     */
    handleDesktopHover: function(event, scene) {
        // Calculer la position de la souris normalisée
        const rect = scene.canvas.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        if (!this.camera) return;

        // Effectuer le raycast
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        const interactables = this.getInteractableObjects(scene);
        const intersects = this.raycaster.intersectObjects(interactables, true);

        // Réinitialiser tous les éléments précédemment survolés
        document.querySelectorAll('.interactable[data-hovered="true"]').forEach(el => {
            el.setAttribute('data-hovered', 'false');
            el.emit('mouseleave');
            this.handleHover(el, false);
        });

        if (intersects.length > 0) {
            let aframeEl = this.findAFrameElement(intersects[0].object);
            if (aframeEl && aframeEl.classList.contains('interactable')) {
                aframeEl.setAttribute('data-hovered', 'true');
                aframeEl.emit('mouseenter');
                this.handleHover(aframeEl, true);
            }
        }
    },

    /**
     * Récupère tous les objets Three.js interactables
     * @param {Element} scene - La scène A-Frame
     * @returns {Array} Liste des objets Three.js
     */
    getInteractableObjects: function(scene) {
        const objects = [];
        const interactables = document.querySelectorAll('.interactable');
        
        interactables.forEach(el => {
            if (el.object3D) {
                objects.push(el.object3D);
            }
        });

        return objects;
    },

    /**
     * Trouve l'élément A-Frame parent d'un objet Three.js
     * @param {Object3D} object3D - Objet Three.js
     * @returns {Element|null} Élément A-Frame
     */
    findAFrameElement: function(object3D) {
        let current = object3D;
        while (current) {
            if (current.el) {
                return current.el;
            }
            current = current.parent;
        }
        return null;
    },

    /**
     * Gère l'effet hover sur un élément
     * @param {Element} element - L'élément survolé
     * @param {boolean} isHovering - État du hover
     */
    handleHover: function(element, isHovering) {
        if (isHovering) {
            // Sauvegarder la couleur originale
            const originalColor = element.getAttribute('color') || '#ffffff';
            element.setAttribute('data-original-color', originalColor);
            
            // Appliquer un effet de surbrillance
            element.setAttribute('color', this.lightenColor(originalColor, 30));
            element.setAttribute('scale', '1.05 1.05 1.05');
        } else {
            // Restaurer la couleur originale
            const originalColor = element.getAttribute('data-original-color');
            if (originalColor) {
                element.setAttribute('color', originalColor);
            }
            element.setAttribute('scale', '1 1 1');
        }
    },

    /**
     * Enregistre un composant A-Frame pour les objets cliquables
     */
    registerClickableComponent: function() {
        AFRAME.registerComponent('clickable', {
            schema: {
                objectId: { type: 'string', default: '' },
                type: { type: 'string', default: 'object' } // 'object', 'bonus', 'button'
            },

            init: function() {
                const el = this.el;
                const data = this.data;

                // Ajouter la classe interactable
                el.classList.add('interactable');

                // Événement click
                el.addEventListener('click', () => {
                    const event = new CustomEvent('object:click', {
                        detail: {
                            element: el,
                            objectId: data.objectId,
                            type: data.type
                        }
                    });
                    document.dispatchEvent(event);
                });

                // Hover effect via raycaster
                el.addEventListener('raycaster-intersected', () => {
                    el.emit('hover-start');
                });

                el.addEventListener('raycaster-intersected-cleared', () => {
                    el.emit('hover-end');
                });
            }
        });
    },

    /**
     * Active le retour haptique sur la manette
     * @param {string} hand - 'left' ou 'right'
     * @param {number} intensity - Intensité de 0 à 1
     * @param {number} duration - Durée en ms
     */
    vibrate: function(hand = 'right', intensity = 0.5, duration = 100) {
        const controller = hand === 'right' ? this.rightController : this.leftController;
        if (!controller) return;

        // Utiliser l'API Gamepad pour la vibration
        const gamepad = controller.components['tracked-controls']?.controller;
        if (gamepad && gamepad.hapticActuators && gamepad.hapticActuators.length > 0) {
            gamepad.hapticActuators[0].pulse(intensity, duration);
        }
    },

    /**
     * Éclaircit une couleur hex
     * @param {string} color - Couleur hex
     * @param {number} percent - Pourcentage d'éclaircissement
     * @returns {string} Couleur éclaircie
     */
    lightenColor: function(color, percent) {
        if (!color.startsWith('#')) return color;
        
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.min(255, (num >> 16) + amt);
        const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
        const B = Math.min(255, (num & 0x0000FF) + amt);
        
        return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
    },

    /**
     * Émet un événement personnalisé
     * @param {string} eventName - Nom de l'événement
     * @param {object} detail - Détails de l'événement
     */
    emit: function(eventName, detail = {}) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }
};

export { VRController };
