let Vr = {};

// Vr.setupControllerClickHandler = function (controllerSelector) {
//     let controller = document.querySelector(controllerSelector);
//     console.log("teste clique sur tout les objet");
//     controller.addEventListener('selectstart', function () {
//         let intersectedEl = controller.components.raycaster.intersectedEls[0];
//         if (intersectedEl) {
//             console.log("Clic sur :", intersectedEl);
//             let clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
//             intersectedEl.dispatchEvent(clickEvent);
//         }
//     });
// }
Vr.setupControllerClickHandler = function () {
    AFRAME.registerComponent("occulus-grab", {
        init: function () {
            let el = this.el;
            let isGrabbed = false;
            let controller = null;

            this.onGrabStart = (evt) => {
                let raycaster = evt.target.components.raycaster;
                if (!raycaster) return;

                let intersectedEls = raycaster.intersectedEls;
                if (intersectedEls.length === 0 || intersectedEls[0] !== el) return;

                isGrabbed = true;
                controller = evt.target;
                el.setAttribute("dynamic-body", "mass: 0");
                el.setAttribute("grab", "")
                controller.addEventListener("triggerup", this.onGrabEnd);
            };

            this.onGrabEnd = () => {
                if (isGrabbed) {
                    el.setAttribute("dynamic-body", "mass: 1; restitution: 0.5; friction: 0.5");
                    el.removeAttribute("grab");
                    isGrabbed = false;
                    controller.removeEventListener("triggerup", this.onGrabEnd);
                    controller = null;
                }
            };

            this.tick = function () {
                if (isGrabbed && controller) {
                    let controllerPos = new THREE.Vector3();
                    let controllerQuat = new THREE.Quaternion();

                    controller.object3D.getWorldPosition(controllerPos);
                    controller.object3D.getWorldQuaternion(controllerQuat);

                    // Appliquer la position directement pour un déplacement fluide
                    let offset = new THREE.Vector3(-0.5, -1.8, -2.7);
                    offset.applyQuaternion(controllerQuat);

                    let newPosition = controllerPos.clone().add(offset);
                    el.object3D.position.copy(newPosition);
                }
            };
            // Écoute directement sur le contrôleur
            el.sceneEl.addEventListener("triggerdown", this.onGrabStart);
        }
    });
};



export { Vr };