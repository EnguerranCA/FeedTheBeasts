/**
 * Camera.js - Gestion de la caméra et du rig
 * Gère les déplacements, transitions et positions de la caméra
 */

const Camera = {
    // Référence au rig et à la caméra
    rig: null,
    head: null,

    // Positions prédéfinies
    positions: {
        menu: { x: 0, y: 0, z: 0 },
        game: { x: 0, y: 0, z: 2 },
        counter: { x: 0, y: 0, z: -2 }
    },

    /**
     * Initialise le module caméra
     */
    init: function() {
        console.log('[Camera] Initialisation...');
        
        this.rig = document.querySelector('#rig');
        this.head = document.querySelector('#head');

        // Enregistrer le composant de déplacement fluide
        this.registerMoveToComponent();
    },

    /**
     * Enregistre le composant A-Frame pour le déplacement fluide
     */
    registerMoveToComponent: function() {
        if (AFRAME.components['smooth-move-to']) {
            return; // Déjà enregistré
        }

        AFRAME.registerComponent('smooth-move-to', {
            schema: {
                to: { type: 'vec3' },
                duration: { type: 'number', default: 2000 },
                easing: { type: 'string', default: 'easeInOutQuad' }
            },

            init: function() {
                const position = this.el.getAttribute('position');
                this.startPos = new THREE.Vector3(position.x, position.y, position.z);
                this.endPos = new THREE.Vector3(this.data.to.x, this.data.to.y, this.data.to.z);
                this.elapsedTime = 0;
                this.moving = true;
            },

            tick: function(time, deltaTime) {
                if (!this.moving) return;

                this.elapsedTime += deltaTime;
                let t = Math.min(this.elapsedTime / this.data.duration, 1);

                // Appliquer l'easing
                t = this.applyEasing(t, this.data.easing);

                // Interpoler la position
                const newPos = new THREE.Vector3().lerpVectors(this.startPos, this.endPos, t);
                this.el.setAttribute('position', `${newPos.x} ${newPos.y} ${newPos.z}`);

                if (t >= 1) {
                    this.moving = false;
                    this.el.emit('move-complete');
                    this.el.removeAttribute('smooth-move-to');
                }
            },

            applyEasing: function(t, easing) {
                switch (easing) {
                    case 'linear':
                        return t;
                    case 'easeInQuad':
                        return t * t;
                    case 'easeOutQuad':
                        return t * (2 - t);
                    case 'easeInOutQuad':
                        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
                    case 'easeInCubic':
                        return t * t * t;
                    case 'easeOutCubic':
                        return (--t) * t * t + 1;
                    case 'easeInOutCubic':
                        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
                    default:
                        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
                }
            }
        });
    },

    /**
     * Déplace le rig vers une position
     * @param {object} startPos - Position de départ {x, y, z}
     * @param {object} endPos - Position d'arrivée {x, y, z}
     * @param {number} duration - Durée en ms
     * @param {string} easing - Type d'easing
     * @returns {Promise} Résolu quand le mouvement est terminé
     */
    moveTo: function(startPos, endPos, duration = 2000, easing = 'easeInOutQuad') {
        return new Promise((resolve) => {
            if (!this.rig) {
                console.warn('[Camera] Rig non initialisé');
                resolve();
                return;
            }

            // Définir la position de départ
            this.rig.setAttribute('position', `${startPos.x} ${startPos.y} ${startPos.z}`);

            // Appliquer le composant de mouvement
            this.rig.setAttribute('smooth-move-to', {
                to: endPos,
                duration: duration,
                easing: easing
            });

            // Écouter la fin du mouvement
            const onComplete = () => {
                this.rig.removeEventListener('move-complete', onComplete);
                resolve();
            };
            this.rig.addEventListener('move-complete', onComplete);
        });
    },

    /**
     * Déplace le rig vers une position prédéfinie
     * @param {string} positionName - Nom de la position ('menu', 'game', 'counter')
     * @param {number} duration - Durée en ms
     * @returns {Promise}
     */
    moveToPreset: function(positionName, duration = 2000) {
        const targetPos = this.positions[positionName];
        if (!targetPos) {
            console.warn('[Camera] Position inconnue:', positionName);
            return Promise.resolve();
        }

        const currentPos = this.getPosition();
        return this.moveTo(currentPos, targetPos, duration);
    },

    /**
     * Obtient la position actuelle du rig
     * @returns {object} Position {x, y, z}
     */
    getPosition: function() {
        if (!this.rig) return { x: 0, y: 0, z: 0 };
        const pos = this.rig.getAttribute('position');
        return { x: pos.x, y: pos.y, z: pos.z };
    },

    /**
     * Définit la position du rig instantanément
     * @param {object} position - Position {x, y, z}
     */
    setPosition: function(position) {
        if (!this.rig) return;
        this.rig.setAttribute('position', `${position.x} ${position.y} ${position.z}`);
    },

    /**
     * Obtient la rotation de la tête (regard de l'utilisateur)
     * @returns {object} Rotation {x, y, z}
     */
    getHeadRotation: function() {
        if (!this.head) return { x: 0, y: 0, z: 0 };
        const rot = this.head.getAttribute('rotation');
        return { x: rot.x, y: rot.y, z: rot.z };
    },

    /**
     * Secoue la caméra (effet de tremblement)
     * @param {number} intensity - Intensité du tremblement
     * @param {number} duration - Durée en ms
     */
    shake: function(intensity = 0.1, duration = 500) {
        if (!this.rig) return;

        const startPos = this.getPosition();
        const startTime = Date.now();

        const shakeLoop = () => {
            const elapsed = Date.now() - startTime;
            if (elapsed >= duration) {
                this.setPosition(startPos);
                return;
            }

            const progress = elapsed / duration;
            const currentIntensity = intensity * (1 - progress); // Diminue avec le temps

            const offsetX = (Math.random() - 0.5) * currentIntensity;
            const offsetY = (Math.random() - 0.5) * currentIntensity;
            const offsetZ = (Math.random() - 0.5) * currentIntensity;

            this.setPosition({
                x: startPos.x + offsetX,
                y: startPos.y + offsetY,
                z: startPos.z + offsetZ
            });

            requestAnimationFrame(shakeLoop);
        };

        shakeLoop();
    },

    /**
     * Effet de fade (noir)
     * @param {boolean} fadeIn - true pour fade in, false pour fade out
     * @param {number} duration - Durée en ms
     * @returns {Promise}
     */
    fade: function(fadeIn = true, duration = 500) {
        return new Promise((resolve) => {
            let fadeOverlay = document.querySelector('#camera-fade-overlay');
            
            if (!fadeOverlay) {
                // Créer l'overlay de fade
                fadeOverlay = document.createElement('a-plane');
                fadeOverlay.id = 'camera-fade-overlay';
                fadeOverlay.setAttribute('position', '0 0 -0.5');
                fadeOverlay.setAttribute('width', '2');
                fadeOverlay.setAttribute('height', '2');
                fadeOverlay.setAttribute('color', '#000000');
                fadeOverlay.setAttribute('material', 'shader: flat; transparent: true; opacity: 0');
                this.head.appendChild(fadeOverlay);
            }

            const startOpacity = fadeIn ? 0 : 1;
            const endOpacity = fadeIn ? 1 : 0;

            fadeOverlay.setAttribute('animation', {
                property: 'material.opacity',
                from: startOpacity,
                to: endOpacity,
                dur: duration,
                easing: 'linear'
            });

            setTimeout(resolve, duration);
        });
    }
};

export { Camera };
