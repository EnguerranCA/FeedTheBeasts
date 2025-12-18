import { Sound } from "../audio/audio.js";
import { Animations } from "../animations/animations.js";
import { Users } from "../../data/data-user.js";
import { Money } from "../money-counter/money-counter.js";
import { Rounds } from "../rounds/rounds.js";

// Keyboard template
const templateFile = await fetch("./src/components/keyboard/template.html.inc");
const template = await templateFile.text();

// Input template
const inputTemplateFile = await fetch(
  "./src/components/keyboard/templateInput.html.inc",
);
const inputTemplate = await inputTemplateFile.text();

const scene = document.querySelector("#mainScene");

let Keyboard = {};

let textEntered = "";

// Render the keyboard
Keyboard.render = function () {
  const tempDiv = document.createElement("a-entity");
  tempDiv.id = "keyboard";
  tempDiv.innerHTML = template;
  scene.appendChild(tempDiv);

  tempDiv.addEventListener("click", Keyboard.keyClicked);

  Keyboard.renderInput();
};

// Add the event listener to the keys
Keyboard.keyClicked = function (event) {
  //Add sound when a key is pressed
  Sound.keyboardSound();

  // Limit the characters to 20
  
  const key = event.target.querySelector("a-text").getAttribute("value");

  //animation when a key is pressed
  Animations.keyPressed(event.target);


  if (key === "Del") {
    textEntered = textEntered.slice(0, -1);
  } else if (key === "OK") {
    // save the username and the score
    Users.addUser(textEntered, Money.getMoney());

    // remove the keyboard
    Keyboard.remove();
  } else {
    if (textEntered.length >= 15) {
      return;
    }
    textEntered += key;
  }

  Keyboard.updateInput();
};

Keyboard.renderInput = function () {
  const tempDiv = document.createElement("a-entity");
  tempDiv.id = "input";
  tempDiv.innerHTML = inputTemplate;
  scene.appendChild(tempDiv);

  Keyboard.updateInput();
};

Keyboard.updateInput = function () {
  document.querySelector("#input-text").setAttribute("value", textEntered + "_");
};

// Remove the keyboard
Keyboard.remove = function () {
  
  const keyboard = document.querySelector("#keyboard");

  // Animation of keyboard removal
  keyboard.setAttribute("animation", {
    property: "position",
    to: "0.99 -3 -36",
    dur: 1000,
    easing: "easeInOutQuad",
  });

  //remove the input
  const input = document.querySelector("#input");
  input.setAttribute("animation", {
    property: "position",
    to: "0.99 -3 -36",
    dur: 1000,
    easing: "easeInOutQuad",
  });


  
  // Remove the ending screen
  Rounds.removeEndingScreen();

  // Remove
  setTimeout(() => {
  keyboard.parentNode.removeChild(keyboard);

  const input = document.querySelector("#input");
  input.parentNode.removeChild(input);
  

  // Restart the game
  Rounds.startGame();

  }, 1000);
  
};

export { Keyboard };
