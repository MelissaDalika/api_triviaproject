
axios
  .get("https://opentdb.com/api.php?amount=10&category=11&difficulty=easy&type=multiple")
  .then((response) => {
    let question = response.data.results;
    questionBuilder(question)
  });
  

function questionBuilder(questionArr) {
  let questionText = questionArr[0].question;
  let correctAnswer = questionArr[0].correct_answer;
  let wrongAnswers = questionArr[0].incorrect_answers;

  let possibleAnswers = wrongAnswers.concat(correctAnswer);
  console.log(possibleAnswers);
  shuffle(possibleAnswers);
  console.log(possibleAnswers);

  document.getElementById("question").innerHTML = questionText;
  
}


//Funzione di shuffle presa online che shuffle non esiste di default in js
function shuffle(arra1) {
  let ctr = arra1.length;
  let temp;
  let index;

  // While there are elements in the array
  while (ctr > 0) {
  // Pick a random index
      index = Math.floor(Math.random() * ctr);
  // Decrease ctr by 1
      ctr--;
  // And swap the last element with it
      temp = arra1[ctr];
      arra1[ctr] = arra1[index];
      arra1[index] = temp;
  }
  return arra1;
}