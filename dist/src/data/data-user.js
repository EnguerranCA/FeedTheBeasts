let Users = {};

Users.getAll = function () {
  return data;
};

Users.getTopUsers = async function () {
  // Fetch the top players
  let response = await fetch("https://mmi.unilim.fr/~savary23/Let_Him_Quizz/api/user?param=top10");
  let usersTop = await response.json();
  
  return usersTop;
};

Users.addUser = async function (username, score) {
  // Add a new user
  let response = await fetch("https://mmi.unilim.fr/~savary23/Let_Him_Quizz/api/user?param=addUser&username=" + username + "&score=" + score);
}

export { Users };