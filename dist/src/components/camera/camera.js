/**
 * Moves the camera from a start position to an end position over a specified duration.
 *
 * @param {number} duration - The duration of the camera movement in milliseconds.
 * @param {number[]} startPosition - The starting position of the camera as an array [x, y, z].
 * @param {number[]} endPosition - The ending position of the camera as an array [x, y, z].
 *
 * @example
 * // Move the camera from position [0, 0, 0] to [10, 10, 10] over 2000 milliseconds
 * camera.moveCamera(2000, [0, 0, 0], [10, 10, 10]);
 */
let Camera = {};

AFRAME.registerComponent('move-to', {
    schema: {
        to: { type: 'vec3' },
        duration: { type: 'number', default: 3000 } // Durée en millisecondes
    },

    init: function () {
        let position = this.el.getAttribute('position'); // Récupérer la position actuelle
        this.startPos = new THREE.Vector3(position.x, position.y, position.z); // Fixer une fois la position de départ
        this.endPos = new THREE.Vector3(this.data.to.x, this.data.to.y, this.data.to.z);
        this.elapsedTime = 0;
        this.moving = true;
    },

    tick: function (time, deltaTime) {
        if (!this.moving) return;

        this.elapsedTime += deltaTime;
        let t = Math.min(this.elapsedTime / this.data.duration, 1); // Valeur entre 0 et 1

        // Calculer la nouvelle position interpolée
        let newPos = new THREE.Vector3().lerpVectors(this.startPos, this.endPos, t);

        // Appliquer la nouvelle position
        this.el.setAttribute('position', `${newPos.x} ${newPos.y} ${newPos.z}`);

        if (t >= 1) {
            this.moving = false; // Stopper l'animation
        }
    }
});


// Fonction pour déclencher le déplacement
Camera.moveCameraVR = function (startPos, endPos, duration) {
    let rig = document.querySelector('#rig');

    // Forcer la position de départ
    rig.setAttribute('position', `${startPos.x} ${startPos.y} ${startPos.z}`);

    // Appliquer l'animation avec la bonne durée
    rig.setAttribute('move-to', `to: ${endPos.x} ${endPos.y} ${endPos.z}; duration: ${duration}`);
}





export { Camera };