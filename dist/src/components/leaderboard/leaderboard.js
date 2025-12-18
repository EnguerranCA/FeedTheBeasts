import { Users } from "../../data/data-user.js";

let Leaderboard = {};
const scene = document.querySelector('#mainScene');

const templateFile = await fetch(
  "./src/components/leaderboard/template.html.inc",
);
const template = await templateFile.text();

Leaderboard.renderZone = async function() {
  let usersTop = await Users.getTopUsers();

  // If there is already a leaderboard, remove it
  if (document.querySelector("#scoreboard")) {
    Leaderboard.remove();
  }

  // Creating the empty leaderboard
  const tempDiv = document.createElement("div");
  tempDiv.id = "leaderboardZone";

  let templateEdited = template;


  // Add user scores to the scoreboard
  usersTop.forEach((user, index) => {
    templateEdited = templateEdited.replace(`{{user${index+1}}}`, `${index+1}. ` + user.username).replace(`{{score${index+1}}}`, user.score);
  });

  // If there is less than 10 users, leave the rest of the scoreboard empty
  for (let i = usersTop.length; i < 10; i++) {
    templateEdited = templateEdited.replace(`{{user${i+1}}}`, "").replace(`{{score${i+1}}}`, "");
  }

  tempDiv.innerHTML = templateEdited;

  const entities = tempDiv.querySelectorAll("#scoreboard");

  entities.forEach((entity) => {
    scene.appendChild(entity);
  });

}

Leaderboard.remove = function() {
  const leaderboardZone = document.querySelector("#scoreboard");
  leaderboardZone.remove();

} 


export { Leaderboard };
