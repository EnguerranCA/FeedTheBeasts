import { Place } from "../../data/data-place.js";
import { Money } from "../money-counter/money-counter.js";
import { Users } from "../../data/data-user.js";
import { Light } from "../light/light.js";
import { Sound } from "../audio/audio.js";
import { TickingAway } from "../ticking-away/ticking-away.js";
import { FindThePlace } from "../find-the-place/find-the-place.js";
import { Leaderboard } from "../leaderboard/leaderboard.js";
import { sorryNotSoRich } from "../sorrynotsorich/sorrynotsorich.js";
import { SortItOut } from "../sort-it-out/sort-it-out.js";
import { Keyboard } from "../keyboard/keyboard.js";

// Import of the speech bubble template
const templateFile = await fetch("./src/components/rounds/template.html.inc");
const template = await templateFile.text();

// Import of the explanation zone template
const templateExplanationFile = await fetch("./src/components/rounds/templateExplanation.html.inc");
const templateExplanation = await templateExplanationFile.text();

// Import of the menu template
const templateMenuFile = await fetch("./src/components/rounds/templateMenu.html.inc");
const templateMenu = await templateMenuFile.text();

// Import of the ending screen template
const templateEndFile = await fetch("./src/components/rounds/templateEnding.html.inc");
const templateEnd = await templateEndFile.text();


const scene = document.querySelector("#mainScene");

let Rounds = {};

// Boolean to check if the instructions are displayed
let instructionsDisplayed = false;

//Set the order of the rounds
let roundsOrder = [
  "TickingAway",
  "FindThePlace",
  "SortItOut",
  "SorryNotSoRich",
];
let actualRound = "";
let roundCounter = 1;

Rounds.startGame = async function () {
  // Reset everything
  Money.setMoney(0);
  roundCounter = 1;

  // Render the money counter
  Money.renderMoneyZone();

  // Render the leaderboard
  Leaderboard.renderZone();

  document
    .querySelector("#anchorman")
    .addEventListener("click", Rounds.clickOnAnchorman);


  Rounds.renderMenu();
};

Rounds.nextRound = async function () {
  // End the game if the round counter is greater than the length of roundsOrder
  if (roundCounter > roundsOrder.length) {
    setTimeout(() => {
      Rounds.endGame();
    }
      , 1000);
    return;
  }

  console.log("Round: ", roundCounter, " - ", roundsOrder[roundCounter - 1]);

  // Remove the previous round's quiz zone if it's not the first round
  if (roundCounter != 1) {
    if (actualRound === "FindThePlace") {
      FindThePlace.removeQuizZone();
    } else if (actualRound === "TickingAway") {
      TickingAway.removeQuizZone();
    } else if (actualRound === "SortItOut") {
      SortItOut.removeSortItOutZone();
    } else if (actualRound === "SorryNotSoRich") {
      sorryNotSoRich.removeQuizZone();
    }
  }

  // Change the actual round to the next one
  setTimeout(() => {
    actualRound = roundsOrder[roundCounter - 1];
  }, 500); // Adjust the timeout duration as needed

  // Render the current round's explanation zone
  Rounds.renderExplanationZone(roundExplanations[roundsOrder[roundCounter - 1]]);

  // Wait for the explanation to be read
  const checkInstructionsDisplayed = async () => {
    // If the instructions arent displayed, render the quiz zone
    if (!instructionsDisplayed) {
      setTimeout(() => {
        if (actualRound === "FindThePlace") {
          FindThePlace.renderPropositionsZone();
          FindThePlace.renderQuestion();
        } else if (actualRound === "TickingAway") {
          TickingAway.renderQuizZone();
          TickingAway.newQuestion();
          TickingAway.startTimer();
        } else if (actualRound === "SortItOut") {
          SortItOut.resetCounter();
          SortItOut.renderSortItOutZone();
        } else if (actualRound === "SorryNotSoRich") {
          sorryNotSoRich.renderQuizZone();
        }
      }, 500);

      roundCounter++;

      // Else, check again after a short delay
    } else {
      setTimeout(checkInstructionsDisplayed, 100);
    }
  };

  checkInstructionsDisplayed();

};

Rounds.endGame = function () {

  // Remove the quiz zone
  if (actualRound === "FindThePlace") {
    FindThePlace.removeQuizZone();
  } else if (actualRound === "TickingAway") {
    TickingAway.removeQuizZone();
  } else if (actualRound === "SortItOut") {
    SortItOut.removeSortItOutZone();
  } else if (actualRound === "SorryNotSoRich") {
    sorryNotSoRich.removeQuizZone();
  }

  setTimeout(() => {
    // Render the keyboard
    Keyboard.render();
    Money.removeMoneyZone();

    // Render the ending screen
    const endingScreen = document.createElement("a-entity");
    endingScreen.id = "endingScreen";
    endingScreen.innerHTML = templateEnd.replace("{{final-score}}", Money.getMoney());
    scene.appendChild(endingScreen);
  }, 1000);

};

// Explain the game in a speech bubble
Rounds.explainGame = function (explanationText) {

  // Render the explanation
  const explanationHtml = document.createElement("a-entity");
  explanationHtml.id = "explanationZone";
  explanationHtml.innerHTML = template.replace("{{message}}", explanationText);
  console.log("Explanation: ", explanationHtml);
  scene.appendChild(explanationHtml);

  setTimeout(() => {
    Rounds.removeExplanation();
  }, 3000);
};

// Remove the ending screen
Rounds.removeEndingScreen = function () {
  const endingScreen = document.querySelector("#endingScreen");
  endingScreen.setAttribute("animation", {
    property: "position",
    to: "0 -6 0",
    dur: 600,
    easing: "easeInOutQuad",
  });


  setTimeout(() => {
    endingScreen.remove();
    Leaderboard.remove();
  }, 700);
};

Rounds.removeExplanation = function () {
  // Remove the explanation
  explanationZone.setAttribute("animation", {
    property: "position",
    to: "0 -6 0",
    dur: 600,
    easing: "easeInOutQuad",
  });

  setTimeout(() => {
    const explanationZone = document.querySelector("#explanationZone");
    explanationZone.remove();
  }, 700);
};

let isPopupOpen = false;

Rounds.clickOnAnchorman = function () {
  // Prevent the user from clicking on the anchorman again
  if (isPopupOpen) return;

  // Explain the game with a speech bubble
  if (actualRound === "FindThePlace") {
    Rounds.explainGame("Find the correct place");
  } else if (actualRound === "TickingAway") {
    Rounds.explainGame("Answer the questions before the timer runs out");
  } else if (actualRound === "SortItOut") {
    Rounds.explainGame("Sort the answers in the correct order");
  } else if (actualRound === "SorryNotSoRich") {
    Rounds.explainGame("Bet on the correct answer but save some money!");
  }

  isPopupOpen = true;

  // Remove the explanation
  setTimeout(() => {
    Rounds.removeExplanation();
    setTimeout(() => {
      isPopupOpen = false;
    }, 1000);
  }, 5000);
};

const roundExplanations = {
  "FindThePlace": "Find the place \n In each round, you will be dropped in a place in the world. \n Then, you will have to guess between 4 propositions where you were. \n Look for signs, driving side, flags and other clues ! \n Each good answer gives you 300$",
  "TickingAway": "Ticking away \n You will have 30 seconds to answer as much questions as you can. \n But be careful, a wrong answer will make you lose some time! \n Each good answer gives you 100$",
  "SortItOut": "Sort it out \n Sort the answers in the crescent order by moving the colored cubes in the right box. \n Then, lock your answer and cross your fingers ! \n Each good answer gives you 200$",
  "SorryNotSoRich": "Sorry not so rich \n Bet on the correct answer by spreading your money between the 4 propositions. \n But be careful, you will lose the money you bet on wrong answers !"
}


Rounds.renderExplanationZone = function (roundName) {
  // Change the boolean
  instructionsDisplayed = true;

  // Render the explanation zone
  const explanationZone = document.createElement("a-entity");
  explanationZone.id = "explanationZone";
  explanationZone.innerHTML = templateExplanation.replace(
    "{{explanation}}",
    roundName
  );
  scene.appendChild(explanationZone);

  // add a listener on the button to continue
  const button = document.querySelector("#validButton-explanation");

  button.addEventListener("click", Rounds.removeExplanationZone);

}

Rounds.removeExplanationZone = function () {
  // Change the boolean
  instructionsDisplayed = false;
  console.log("Remove explanation zone");

  // make an animation to remove the explanation zone
  const explanationZone = document.querySelector("#explanationZone");
  explanationZone.setAttribute("animation", {
    property: "position",
    to: "0 -6 0",
    dur: 600,
    easing: "easeInOutQuad",
  });

  // Remove the explanation zone
  setTimeout(() => {
    explanationZone.remove();
  }, 700);
}

Rounds.renderMenu = function () {
  // Render the menu
  const menu = document.createElement("a-entity");
  menu.id = "menuZone";
  menu.innerHTML = templateMenu;
  scene.appendChild(menu);

  // Add the event listeners on the button
  const startButtons = document.querySelectorAll(".startButton-menu");

  startButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      Rounds.removeMenu();
      // Store the category in window
      window.category = event.target.dataset.category;
    });
  } );
  
  

};

Rounds.removeMenu = function () {
  // Remove the menu
  const menuZone = document.querySelector("#menuZone");
  menuZone.setAttribute("animation", {
    property: "position",
    to: "0 -6 0",
    dur: 600,
    easing: "easeInOutQuad",
  });

  
  Sound.renderOST();

  setTimeout(() => {
    menuZone.remove();

    // Start the first round
    Rounds.nextRound();
  }, 700);
};

export { Rounds };
