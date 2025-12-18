import { MCQ } from "../../data/data-mcq.js";
import { TickingAway } from "../ticking-away/ticking-away.js";
const templateFile = await fetch("./src/components/debug-menu/template.html.inc");
const template = await templateFile.text();

const scene = document.querySelector("#mainScene");

let timerValue = 0;

let DebugMenu = {};

DebugMenu.renderChoices = function () {
  // Create the zone for the quiz with the 3d polygons for the answers

  // Create the a-entities for the answers and the question from the template

  const tempDiv = document.createElement("div");
  tempDiv.id = "choicesZone";
  tempDiv.innerHTML = template;
  const entities = tempDiv.querySelectorAll("#choicesZone");

  entities.forEach((entity) => {
    scene.appendChild(entity);
  });

  // Add the event listener for the answers
  const answers = document.querySelectorAll(".answer");

  answers.forEach((answer) => {
    answer.addEventListener("click", DebugMenu.answerClicked);
  });
};

DebugMenu.removeChoices = function () {
  // remove the zone for the quiz with the 3d polygons for the answers
  const quizZone = document.querySelector("#choicesZone");
  quizZone.remove();
};

DebugMenu.answerClicked = function (event) {
  // check if the answer is the correct one
  // if yes, display a message and remove the quiz zone
  // if no, display a message and remove the quiz zone
  console.log(event.target);
  if (event.target.id === "ticking away") {
    console.log("ticking away");
    TickingAway.renderQuizZone();
};
}

export { DebugMenu };
