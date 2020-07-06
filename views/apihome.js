
axios
  .get("https://opentdb.com/api.php?amount=10&category=11&difficulty=easy&type=multiple")
  .then((response) => {
    let question = response.data.results;
    questionBuilder(question)
  });
  
let currentQuestion= 0;
let infoQuestion = {}
function questionBuilder(questionArr) {
  infoQuestion.questionText = questionArr[currentQuestion].question;
  infoQuestion.correctAnswer = questionArr[currentQuestion].correct_answer;
  infoQuestion.wrongAnswers = questionArr[currentQuestion].incorrect_answers;
  console.log(infoQuestion)
  let possibleAnswers = infoQuestion.wrongAnswers.concat(infoQuestion.correctAnswer);
  console.log(possibleAnswers);
  shuffle(possibleAnswers);
  console.log(possibleAnswers);

  document.getElementById("question").innerHTML = infoQuestion.questionText;
  for(let i=0; i<possibleAnswers.length; i++){
  document.getElementById(`answer${i}label`).innerText = possibleAnswers[i]
  }
}
function checkNextQuestion (){
  for(let i=0; i<4; i++){
    if(document.getElementById(`answer${i}`).checked){
      if(document.getElementById(`answer${i}`).innerText == infoQuestion.correctAnswer){
        document.getElementById("result").innerText = "True"
      }else {
        document.getElementById("result").innerText = "False"
      }
    }
  }
}

document.getElementById("confirm").addEventListener("click", () =>{
  checkNextQuestion();
})

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