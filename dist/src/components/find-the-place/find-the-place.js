import { Place } from "../../data/data-place.js";
import { Money } from "../money-counter/money-counter.js";
import { Light } from "../light/light.js";
import { Rounds } from "../rounds/rounds.js";
import { Sound } from "../audio/audio.js";
import { Animations } from "../animations/animations.js";

const templateFile = await fetch(
  "./src/components/find-the-place/template.html.inc",
);
const template = await templateFile.text();

const scene = document.querySelector("#mainScene");

let timerValue = 0;
let placeCounter = 0;
let freezed = false;

let FindThePlace = {};

FindThePlace.renderPropositionsZone = function () {
  // If the placeCounter is 3 or more, we set it back to 0
  if (placeCounter >= 3) {
    placeCounter = 0;
  }
  // Create the zone for the quiz with the 3d polygons for the answers
  // Create the a-entities for the answers and the question from the template
  const tempDiv = document.createElement("div");
  tempDiv.id = "propositionsZone";
  tempDiv.innerHTML = template;
  const entities = tempDiv.querySelectorAll("#propositionsZone");

  entities.forEach((entity) => {
    scene.appendChild(entity);
  });

  // Add the event listener for the answers
  const answers = document.querySelectorAll(".answer");
  answers.forEach((answer) => {
    answer.addEventListener("click", FindThePlace.answerClicked);
  });
};

FindThePlace.removeQuizZone = function () {
  // remove the zone for the quiz with the 3d polygons for the answers
  const propositionsZone = document.querySelector("#propositionsZone");

  // animation to remove the zone smoothly falling in the ground
  propositionsZone.setAttribute("animation", {
    property: "position",
    to: "0.99 -3 -36",
    dur: 1000,
    easing: "easeInOutQuad",
  });

  setTimeout(() => {
    propositionsZone.remove();
  }, 800);
};

FindThePlace.renderQuestion = async function () {
  // get a new place from the Place module
  let place = await Place.getRandomPlace();

  // Renders the sky box with the image of the place inside the 360Box
  const skyElement = document.createElement("a-sky");
  skyElement.setAttribute("class", "interactable");
  skyElement.setAttribute("position", "1.237 3 -35.03326");
  skyElement.setAttribute("id", "360Sky");
  skyElement.setAttribute("radius", "2");
  skyElement.setAttribute(
    "src",
    `./src/assets/360locations/${place.placeImage}`,
  );
  skyElement.setAttribute(
    "animation__enter",
    "property: position; from: 1.237 3 -40; to: 1.237 3 -35.03326; dur: 3000; easing: easeInOutQuad",
  );
  skyElement.setAttribute(
    "animation__scale",
    "property: scale; from: 0.1 0.1 -0.1; to: 1 1 -1; dur: 3000; easing: easeInOutQuad",
  );
  skyElement.setAttribute(
    "animation__exit",
    "property: position; to: 1.237 -10 -35.03326; delay:10000; dur: 3000; easing: easeInOutQuad",
  );

  // Add the sky element to the scene
  scene.appendChild(skyElement);

  // Shuffle the propositions
  let propositions = place.propositions.slice();
  for (let i = propositions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [propositions[i], propositions[j]] = [propositions[j], propositions[i]];
  }

  // Set the propositions to the answer elements
  document
    .querySelector("#answer1 a-text")
    .setAttribute("value", propositions[0]);
  document
    .querySelector("#answer2 a-text")
    .setAttribute("value", propositions[1]);
  document
    .querySelector("#answer3 a-text")
    .setAttribute("value", propositions[2]);
  document
    .querySelector("#answer4 a-text")
    .setAttribute("value", propositions[3]);

  // Add the id "good answer" to the correct answer
  const correctAnswerIndex = propositions.indexOf(place.propositions[0]);
  document
    .querySelector(`#answer${correctAnswerIndex + 1} a-box`)
    .setAttribute("id", "good answer");
};

FindThePlace.answerClicked = function (event) {
  // Prevent clicking on the same answer multiple times
  if (freezed) {
    return;
  }

  // reveal the good answer by changing the color of the boxes
  document.querySelectorAll(".answer a-box").forEach((box) => {
    if (box.getAttribute("id") === "good answer") {
      box.setAttribute("color", "#00ff00");
    } else {
      box.setAttribute("color", "#ff0000");
    }
  });

  // Set an animation attribute to the clicked answer
  const clickedBox = document.querySelector(
    `#${event.target.parentElement.id} a-box`,
  ); // Get the clicked box
  clickedBox.removeAttribute("animation"); // Remove any existing animation
  clickedBox.setAttribute(
    "animation",
    "property: scale; to: 1.1 1.1 1.1; dur: 100; loop: 2; dir: alternate",
  );

  // check if the answer is the correct one
  if (clickedBox.id === "good answer") {
    Sound.renderCorrectAnswer();
    Light.flashColor("#00ff00");
    Animations.anchormanCheer();
    Animations.audienceCheer();

    setTimeout(() => {
      FindThePlace.newRound();
    }, 1000);

    // add score
    Money.summonStack(6);
  } else {
    Sound.renderWrongAnswer();
    Light.flashColor("#ff0000");
    Animations.anchormanDeception();
    setTimeout(() => {
      FindThePlace.newRound();
    }, 1000);
  }

  // Freeze the game to prevent multiple clicks
  freezed = true;
};

FindThePlace.startTimer = function () {
  // start the timer
  timerValue = 0;

  document.querySelector("#timer a-text").setAttribute("value", timerValue);
  setInterval(() => {
    timerValue++;
    document.querySelector("#timer a-text").setAttribute("value", timerValue);

    if (timerValue === 7) {
      FindThePlace.removeQuizZone();
    }
  }, 1000);
};

FindThePlace.newRound = function () {
  placeCounter++;
  if (placeCounter === 3) {
    freezed = false;
    // end the game
    Rounds.nextRound();
  } else {
    // remove the sky box
    const skyBox = document.getElementById("360Sky");
    skyBox.remove();

    // remove the quiz zone
    FindThePlace.removeQuizZone();
    // render a new question
    setTimeout(() => {
      FindThePlace.renderPropositionsZone();
      FindThePlace.renderQuestion();
      freezed = false;
    }, 1200);
  }
};

export { FindThePlace };
