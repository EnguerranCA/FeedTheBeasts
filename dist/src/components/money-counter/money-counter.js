import { MCQ } from "../../data/data-mcq.js";
// Import of the money counter template
const templateFile = await fetch(
  "./src/components/money-counter/template.html.inc",
);
const template = await templateFile.text();

// Import of the money template
const templateMoneyFile = await fetch(
  "./src/components/money-counter/money-template.html.inc",
);
const templateMoney = await templateMoneyFile.text();

const scene = document.querySelector("#mainScene");

let Money = {};

let moneyAmount = 0;

Money.renderMoneyZone = function () {
  // Create the a-entity for the money counter
  const tempDiv = document.createElement("div");
  tempDiv.id = "moneyZone";
  tempDiv.innerHTML = template;
  const entities = tempDiv.querySelectorAll("#moneyZone");

  entities.forEach((entity) => {
    scene.appendChild(entity);
  });
};

Money.removeMoneyZone = function () {
  // remove the zone for the quiz with the 3d polygons for the answers
  const moneyZone = document.querySelector("#moneyZone");
  moneyZone.remove();
};

Money.summonStack = function (amount) {
  // summon the money stack "amount" times with a half second delay between the spawns
  for (let i = 0; i < amount; i++) {
    setTimeout(() => {
      // Create the a-entity for the money stack
      const tempDiv = document.createElement("div");
      tempDiv.id = "moneyStack";

      // Shift the entity randomly
      const x = Math.random() * 1 - 5;
      const z = Math.random() * 1 - 41;

      // default position : -4.525 2.600 -40.62386
      tempDiv.innerHTML = templateMoney.replace("{{x}}", x).replace("{{z}}", z);

      const entity = tempDiv.querySelector("#moneyStack");

      // Add the entity to the scene
      scene.appendChild(entity);

      // Update the money counter
      moneyAmount = moneyAmount + 50;
      Money.updateMoney(moneyAmount);

      // Remove the collisions of the entity after 5 seconds
      setTimeout(() => {
        entity.removeAttribute("dynamic-body");
        entity.setAttribute("static-body", "");
      }, 3000);
    }, i * 500); // 500ms delay
  }
};

Money.updateMoney = async function (money) {
  // update the money counter
  const moneyCounter = document.querySelector("#moneyCount a-text");
  await moneyCounter.setAttribute("value", `$${money} `);
};

Money.getMoney = function () {
  return moneyAmount;
};

Money.setMoney = function (amount) {
  moneyAmount = amount;
  Money.updateMoney(moneyAmount);
  return moneyAmount;
};

Money.removeMoney = function (amount) {
  const moneyStack = document.querySelectorAll("#moneyStack");
  moneyAmount = moneyAmount - 50*amount;
  Money.updateMoney(moneyAmount);
  for (let i = 0; i < amount; i++) {
    if (moneyStack[i]) {
      setTimeout(() => {
        moneyStack[i].remove();
      }, i * 100);
    }
  }
};

Money.removeAllMoneyStack = function () {
  const moneyStacks = document.querySelectorAll("#moneyStack");
  moneyStacks.forEach(stack => stack.remove());
};

export { Money };