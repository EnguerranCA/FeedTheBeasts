import { MCQ } from "../../data/data-mcq.js";
import { Money } from "../money-counter/money-counter.js";
import { Light } from "../light/light.js";

const templateFile = await fetch("src/components/ticking-away/template.html.inc");
const template = await templateFile.text();

const scene = document.querySelector("#mainScene");
const timer = document.querySelector("#timer");

let Animations = {};

Animations.anchormanCheer = function () {
    const anchorman = document.querySelector("#anchorman");
    anchorman.setAttribute("animation-mixer", { clip: "HumanArmature|Man_Clapping", loop: "once" });

    // stop the animation after 1 second
    setTimeout (() => {
      Animations.anchormanIdle();
    }, 1800);
};

Animations.anchormanIdle = function () {
    const anchorman = document.querySelector("#anchorman");
    anchorman.setAttribute("animation-mixer", { clip: "HumanArmature|Man_Idle" });
}

Animations.audienceCheer = function () {
  const audienceMembers = document.querySelectorAll(".audience-member");
  audienceMembers.forEach((member) => {
    member.setAttribute("animation-mixer", { clip: "Armature|Jump", loop: "once" });
  });
  
  // stop the animation after 1 second
  setTimeout (() => {
    Animations.audienceIdle();
  }, 1000);
}

Animations.anchormanDeception = function () {
  const anchorman = document.querySelector("#anchorman");
  anchorman.setAttribute("animation-mixer", { clip: "HumanArmature|Man_SwordSlash", loop: "once" });

  // stop the animation after 1 second
  setTimeout (() => {
    Animations.anchormanIdle();
  }, 1000);
}

Animations.keyPressed = function (key) {
  key.setAttribute("animation", { property: "scale", to: "0.8 0.8 0.8", dur: 100, dir: "alternate", loop: "2" });

  // stop the animation after 1 second
  setTimeout (() => {
    key.removeAttribute("animation");
  }, 300);
}


export { Animations };
