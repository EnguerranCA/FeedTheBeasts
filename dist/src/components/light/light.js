// Code for the light component
let Light = {};

// Change the color for all the lights in the scene
Light.changeColor = function (hexColor) {
  // Select all lights in the scene
  const light = document.querySelectorAll(".light");

  // Change the color of the lights smoothly with Aframe
  light.forEach((el) => {
    // Change the color of the light
    el.setAttribute("animation__color", {
      property: "light.color",
      to: hexColor,
      dur: 500,
      easing: "easeInOutQuad"
    });
  });
};

// Reset the color of the light to white
Light.resetColor = function () {
  Light.changeColor("#FFFFFF");
};

// Flash the color of the light and resets it
Light.flashColor = function (hexColor) {
  Light.changeColor(hexColor);
  setTimeout(() => {
    Light.resetColor();
  }, 1000);
};

export { Light };
