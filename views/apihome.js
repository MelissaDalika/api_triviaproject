
axios
  .get("https://opentdb.com/api.php?amount=10&category=11&difficulty=easy&type=multiple")
  .then((response) => {
    let question = response.data.results;
    questionBuilder(question)
  });
  

function questionBuilder(questionArr) {
  document.getElementById("question").innerHTML = questionArr[0].question;
  
}