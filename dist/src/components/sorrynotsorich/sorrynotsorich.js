import { MCQ } from "../../data/data-mcq.js";
import { Money } from "../money-counter/money-counter.js";
import { Light } from "../light/light.js";
import { Rounds } from "../rounds/rounds.js";
import { Sound } from "../audio/audio.js";

const templateFile = await fetch(
  "./src/components/sorrynotsorich/template.html.inc",
);
const template = await templateFile.text();

const moneyTemplateFile = await fetch(
  "./src/components/sorrynotsorich/money-template.html.inc",
);

const moneyTemplate = await moneyTemplateFile.text();

const scene = document.querySelector("#mainScene");

let sorryNotSoRich = {};

let totalBet = 0;

let questionCounter = 0;

// Render the template in the scene
sorryNotSoRich.renderQuizZone = function () {
  const tempDiv = document.createElement("div");
  tempDiv.id = "sorryNotSoRichDiv";
  tempDiv.innerHTML = template;
  
  questionCounter = 0;

  while (tempDiv.firstChild) {
    scene.appendChild(tempDiv.firstChild);
  }
  sorryNotSoRich.newQuestion();
};

// Get a new question from the MCQ data
sorryNotSoRich.newQuestion = async function () {

  //Increment the question counter
  questionCounter++;

  //Verify if the question counter is equal to 4
  if (questionCounter === 4) {
    setTimeout(() => {
      Rounds.nextRound();
    }, 1500);
    return;
  }

  //Get random hard question
  let question = await MCQ.getRandomQuestion("hard");

  // reset the color of the boxes
  document.querySelectorAll(".answer a-box").forEach((box) => {
    box.setAttribute("color", "#3246E7");
  });

  // Reset totalBet to 0
  totalBet = 0;

  // display the question and the propositions
  document.querySelector("#question a-text").setAttribute("value", question.question);

  // Shuffle the propositions
  let propositions = question.propositions.slice();
  for (let i = propositions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [propositions[i], propositions[j]] = [propositions[j], propositions[i]];
  }

  // Remove the class "good-answer" if it is set
  document.querySelectorAll(".good-answer").forEach((box) => {
    box.classList.remove("good-answer");
  });
  document.querySelectorAll(".good-answerbox").forEach((answer) => {
    answer.classList.remove("good-answerbox");
  });

  // Set the propositions to the answer elements
  document.querySelector("#answer1 a-text").setAttribute("value", propositions[0]);
  document.querySelector("#answer2 a-text").setAttribute("value", propositions[1]);
  document.querySelector("#answer3 a-text").setAttribute("value", propositions[2]);
  document.querySelector("#answer4 a-text").setAttribute("value", propositions[3]);

  // Add the class "good-answer" to the correct answer
  const correctAnswerIndex = propositions.indexOf(question.propositions[0]);
  document.querySelector(`#bet${correctAnswerIndex + 1}`).classList.add("good-answer");
  document.querySelector(`#answer${correctAnswerIndex + 1}`).classList.add("good-answerbox");

  sorryNotSoRich.calculateMoney();
};

// Change the color of the answer boxes based on correctness
sorryNotSoRich.updateAnswerColors = function () {
  const answerBoxes = [
    document.querySelector("#answer1 a-box"),
    document.querySelector("#answer2 a-box"),
    document.querySelector("#answer3 a-box"),
    document.querySelector("#answer4 a-box"),
  ];

  answerBoxes.forEach((box) => {
    if (box.parentElement.classList.contains("good-answerbox")) {
      box.setAttribute("color", "green");
    } else {
      box.setAttribute("color", "red");
    }
  });
};

// Calculate the money that the player has and the money that he is betting
sorryNotSoRich.calculateMoney = function () {

  // Get the money amount gain from the previous games
  let moneyAmount = Money.getMoney();

  //Attributes divs to variables
  const bets = [
    document.querySelector("#bet1"),
    document.querySelector("#bet2"),
    document.querySelector("#bet3"),
    document.querySelector("#bet4"),
  ];

  const plusButtons = [
    document.querySelector("#plus1"),
    document.querySelector("#plus2"),
    document.querySelector("#plus3"),
    document.querySelector("#plus4"),
  ];

  const minusButtons = [
    document.querySelector("#minus1"),
    document.querySelector("#minus2"),
    document.querySelector("#minus3"),
    document.querySelector("#minus4"),
  ];

  const trapdoors = [
    document.querySelector("#trap1"),
    document.querySelector("#trap2"),
    document.querySelector("#trap3"),
    document.querySelector("#trap4"),
  ];

  // Initialize bets to $0
  bets.forEach(bet => bet.setAttribute("value", "$0"));

  // Update the total bet and check if the player can bet more
  const updateTotalBet = () => {
    totalBet = bets.reduce((sum, bet) => sum + parseInt(bet.getAttribute("value").replace('$', '')), 0);
    Money.updateMoney(moneyAmount - totalBet);
    if (totalBet === moneyAmount) {
      Money.removeAllMoneyStack();
    }
  };

  const checkBetStatus = () => {
    const allBetsPlaced = totalBet === moneyAmount;
    plusButtons.forEach(button => button.setAttribute("visible", !allBetsPlaced));
    document.querySelector("#validButton").setAttribute("visible", allBetsPlaced);
    document.querySelector("#validButton a-box").classList.toggle("interactable", allBetsPlaced);
  };

  const canBetMore = (amount) => totalBet + amount <= moneyAmount;

  // Handle the click on the plus button
  const handlePlusButtonClick = (index) => {
    let currentValue = parseInt(bets[index].getAttribute("value").replace('$', ''));
    if (canBetMore(100)) {
      bets[index].setAttribute("value", `$${currentValue + 100}`);
      Money.removeMoney(2); // Remove 2 bills (100 units)
      addMoneyStackToTrapdoor(index);
      updateTotalBet();
      checkBetStatus();
      minusButtons[index].setAttribute("visible", true);
    }
  };

  // Handle the click on the minus button
  const handleMinusButtonClick = (index) => {
    let currentValue = parseInt(bets[index].getAttribute("value").replace('$', ''));
    if (currentValue > 0) {
      bets[index].setAttribute("value", `$${currentValue - 100}`);
      Money.summonStack(2); // Add 2 bills (100 units)
      removeMoneyStackFromTrapdoor(index);
      updateTotalBet();
      checkBetStatus();
      document.querySelector("#validButton a-box").classList.remove("interactable");
    }
    if (parseInt(bets[index].getAttribute("value").replace('$', '')) === 0) {
      minusButtons[index].setAttribute("visible", false);
    }
  };

  // Handle the click on the valid button
  const handleValidButtonClick = () => {
    let correctAnswerBox = document.querySelector(".good-answer");
    console.log("correctAnswerBox: " + correctAnswerBox);
    let correctBet = parseInt(correctAnswerBox.getAttribute("value").replace('$', ''));

    // Play the correct or wrong answer sound
    let majorityBetAmount = totalBet / 2;
    if (correctBet > majorityBetAmount) {
      Sound.renderCorrectAnswer();
      Light.changeColor("green");
    }
    if (correctBet < majorityBetAmount) {
      Sound.renderWrongAnswer();
      Light.changeColor("red");
    }
    if (correctBet === majorityBetAmount) {
      console.log("Tu perds autant d'argent que tu en conserves");
    }

    moneyAmount = Money.setMoney(correctBet);

    //Remove the money from the trapdoors
    setTimeout(() => {
      removeAllMoneyStacksFromTrapdoors();
    }, 1500);

    sorryNotSoRich.updateAnswerColors();
    // Add animation to the wrong answer trapdoors
    for (let i = 1; i <= 4; i++) {
      Sound.renderSwoosh();
      if (!document.querySelector(`#bet${i}`).classList.contains("good-answer")) {
        document.querySelector(`#trap${i}`).removeAttribute("animation__rotation", "property: rotation; to: 0 0 0; loop: false; dur: 1000");
        document.querySelector(`#trap${i}`).setAttribute("animation__rotation", "property: rotation; to: 90 0 0; loop: false; dur: 1000");
      }
    }

    // Reset all bets to $0
    bets.forEach(bet => bet.setAttribute("value", "$0"));
    // Check if the player has any money left
    setTimeout(() => {
      if (correctBet === 0) {
        console.log("You lost all your money!");
        sorryNotSoRich.removeQuizZone();
        Money.removeAllMoneyStack();
      } else {
        // Update and render a new question
        checkBetStatus();
        updateTotalBet();
        sorryNotSoRich.newQuestion();

        // Reset the trapdoors
        for (let i = 1; i <= 4; i++) {
          if (!document.querySelector(`#bet${i}`).classList.contains("good-answer")) {
            document.querySelector(`#trap${i}`).removeAttribute("animation__rotation", "property: rotation; to: 90 0 0; loop: false; dur: 1000");
            document.querySelector(`#trap${i}`).setAttribute("animation__rotation", "property: rotation; to: 0 0 0; loop: false; dur: 1000");
          }
        }
      }
    }, 2000);
  };

  const addMoneyStackToTrapdoor = (index) => {
    const trapdoor = trapdoors[index];
    const moneyStack = document.createElement("a-entity");
    moneyStack.setAttribute("gltf-model", "./src/assets/modele3d/money.glb");

    // Calculate the position based on the number of money stacks already present
    const existingStacks = trapdoor.querySelectorAll(".moneyStack").length;
    const stackIndex = Math.floor(existingStacks / 5);
    const yOffset = (existingStacks % 5) * 0.1; // Adjust the offset as needed
    const xOffset = stackIndex * 0.2; // Adjust the offset for new stacks

    moneyStack.setAttribute("position", `${xOffset} ${yOffset} 0.75`);
    moneyStack.setAttribute("scale", "0.4 0.4 0.4");
    moneyStack.classList.add("moneyStack");
    trapdoor.appendChild(moneyStack);
  };

  const removeMoneyStackFromTrapdoor = (index) => {
    const trapdoor = trapdoors[index];
    const moneyStacks = trapdoor.querySelectorAll(".moneyStack");
    if (moneyStacks.length > 0) {
      trapdoor.removeChild(moneyStacks[moneyStacks.length - 1]);
    }
  };

  const removeAllMoneyStacksFromTrapdoors = () => {
    trapdoors.forEach(trapdoor => {
      const moneyStacks = trapdoor.querySelectorAll(".moneyStack");
      moneyStacks.forEach(stack => trapdoor.removeChild(stack));
    });
  };

  const addEventListeners = () => {
    plusButtons.forEach((button, index) => {
      button.addEventListener("click", () => handlePlusButtonClick(index));
    });

    minusButtons.forEach((button, index) => {
      button.addEventListener("click", () => handleMinusButtonClick(index));
    });

    document.querySelector("#validButton").addEventListener("click", handleValidButtonClick);
  };

  // Remove existing event listeners and add new ones
  plusButtons.forEach((button, index) => {
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    plusButtons[index] = newButton;
  });

  minusButtons.forEach((button, index) => {
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    minusButtons[index] = newButton;
  });

  document.querySelector("#validButton").replaceWith(document.querySelector("#validButton").cloneNode(true));

  // Hide all minus buttons and the valid button at the beginning
  minusButtons.forEach(button => button.setAttribute("visible", false));
  document.querySelector("#validButton").setAttribute("visible", false);
  document.querySelector("#validButton a-box").classList.remove("interactable");

  addEventListeners();
};

sorryNotSoRich.removeQuizZone = function () {
  // remove the zone for the quiz with the 3d polygons for the answers
  const propositionsZone = document.querySelector("#sorrynotsorich-container");


  setTimeout(() => {
    propositionsZone.remove();
  }, 800);

  // animation to remove the zone smoothly falling in the ground
  propositionsZone.setAttribute("animation", {
    property: "position",
    to: "0.99 -3 -36",
    dur: 1000,
    easing: "easeInOutQuad",
  });

  
};

export { sorryNotSoRich };