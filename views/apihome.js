let currentQuestion= 0;
let infoQuestion = {}
let currentPoints = 0;

//Chiamata all'API con ricezione delle domande
axios
  .get("https://opentdb.com/api.php?amount=10&category=11&difficulty=easy&type=multiple")
  .then((response) => {
    infoQuestion.question = response.data.results;
    questionBuilder(infoQuestion.question);
    createRecapListVariant();
});

//Creazione della tabella di riepilogo in funzione del n° di domande
/* function createRecapList() {
  let recapList = document.createElement("ul");
  let recapListRow = document.createElement("li");
  recapList.class = 
  for (let i = 0; i < infoQuestion.question.length; i++) {
    console.log("ciao");
    recapListRow.innerHTML += `<td>${i+1}</td>`
  }

  recapList.appendChild(recapListRow);
  document.getElementById("recapList").appendChild(recapList);
} */

//Creazione della tabella di riepilogo in funzione del n° di domande
function createRecapListVariant() {
  let recapList = document.createElement("ul");
  recapList.setAttribute("class", "list-group list-group-horizontal justify-content-center p-4");

  for (let i = 0; i < infoQuestion.question.length; i++) {
    recapList.innerHTML += `<li class="list-group-item">${i+1}</li>`
  }

  document.getElementById("recapList").appendChild(recapList);
}


//Creazione dei Radio contententi le risposte 
function questionBuilder(questionArr) {
  infoQuestion.questionText = questionArr[currentQuestion].question;
  infoQuestion.correctAnswer = questionArr[currentQuestion].correct_answer;
  infoQuestion.wrongAnswers = questionArr[currentQuestion].incorrect_answers;
  console.log(infoQuestion)
  let possibleAnswers = infoQuestion.wrongAnswers.concat(infoQuestion.correctAnswer);
  shuffle(possibleAnswers);
 

  document.getElementById("question").innerHTML = infoQuestion.questionText;
  for(let i=0; i<possibleAnswers.length; i++){
  document.getElementById(`answer${i}label`).innerText = possibleAnswers[i]
  }
}

// Cerca il Radio selezionato e prendine il valore
function getRadioVal() {
  let selectedRadioValue;
  // get list of radio buttons with specified name
  let radiosArr = document.getElementsByClassName("radioInput");
  
  // loop through list of radio buttons
  for (let i = 0; i < radiosArr.length; i++) {
      if ( radiosArr[i].checked ) { // radio checked?
        console.log("sto andando");
        selectedRadioValue = document.getElementById(`answer${i}label`).innerText; // if so, hold its value in val
          break; // and break out of for loop
      }
  }
  return selectedRadioValue; // return value of checked radio or undefined if none checked
}


//Se risposta giusta aumenta punteggio di 1, altrimenti -1. Cambia colore tabella riepilogo. Aumenta contatore domanda e carica nuova domanda.
function checkIfRight(inputWord) {
  if (inputWord == infoQuestion.correctAnswer) {
    currentPoints++
  } else { currentPoints--}
  currentQuestion++ ;
  questionBuilder(infoQuestion.question);
  console.log(currentPoints);
}


//Event Listener BOTTONE
document.getElementById("confirm").addEventListener("click", () =>{
  checkIfRight(getRadioVal());
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


/* function checkNextQuestion (){
  for(let i=0; i<4; i++){
    console.log(document.getElementById(`answer${i}`).checked);
    if(document.getElementById(`answer${i}`).checked){
      console.log(document.getElementById(`answer${i}`).innerText);
      if(document.getElementById(`answer${i}`).innerHTML == infoQuestion.correctAnswer){
        console.log(infoQuestion.correctAnswer);
        document.getElementById("result").innerText = "True"
      }
      break;
    }
  }
} */