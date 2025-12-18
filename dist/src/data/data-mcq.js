let data = await fetch("./src/data/json/mcq.json");
data = await data.json();

let MCQ = {};

let latestQuestions = [];

MCQ.getAll = function () {
  return data;
};

MCQ.getRandomQuestion = async function (difficulty) {

  // Fetch a random question based on the difficulty and fetch again if the question has already been asked
  let newQuestion;
  do {
    let response = await fetch("https://mmi.unilim.fr/~savary23/Let_Him_Quizz/api/MCQ?difficulty=" + difficulty + "&category=" + window.category);
    newQuestion = await response.json();
  } while (latestQuestions.includes(newQuestion.id));

  // Format question
  let question = newQuestion.question;
  let propositions = [
    newQuestion.reponse1,
    newQuestion.reponse2,
    newQuestion.reponse3,
    newQuestion.reponse4
  ];

  // Add the id of the question to the latestQuestions array
  latestQuestions.push(newQuestion.id);

  // If the latestQuestions array is greater than 10, remove the first element
  if (latestQuestions.length > 10) {
    latestQuestions.shift();
  }


  return { question, propositions };
};

export { MCQ };
