let currentQuestion= 0;
let infoQuestions = {}
let currentPoints = 0;

//Chiamata all'API con ricezione delle domande
axios
  .get("https://opentdb.com/api.php?amount=10&category=11&difficulty=easy&type=multiple")
  .then((response) => {
    infoQuestions.questions = response.data.results;
    questionBuilder(infoQuestions.questions);
    createRecapListVariant();
});

//Creazione della tabella di riepilogo in funzione del n° di domande
/* function createRecapList() {
  let recapList = document.createElement("ul");
  let recapListRow = document.createElement("li");
  recapList.class = 
  for (let i = 0; i < infoQuestions.questions.length; i++) {
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

  for (let i = 0; i < infoQuestions.questions.length; i++) {
    recapList.innerHTML += `<li class="list-group-item">${i+1}</li>`
  }

  document.getElementById("recapList").appendChild(recapList);
}


//Creazione dei Radio contententi le risposte 
function questionBuilder(questionArr) {
  infoQuestions.questionText = questionArr[currentQuestion].questions;
  infoQuestions.correctAnswer = questionArr[currentQuestion].correct_answer;
  infoQuestions.wrongAnswers = questionArr[currentQuestion].incorrect_answers;
  console.log("questionBuilder sta andando")
  let possibleAnswers = infoQuestions.wrongAnswers.concat(infoQuestions.correctAnswer);
  shuffle(possibleAnswers);
 

  document.getElementById("question").innerHTML = infoQuestions.questionText;
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
        console.log("getRadioVal sta andando");
        selectedRadioValue = document.getElementById(`answer${i}label`).innerText; // if so, hold its value in val
          break; // and break out of for loop
      }
  }
  return selectedRadioValue; // return value of checked radio or undefined if none checked
}


//Se risposta giusta aumenta punteggio di 1, altrimenti -1. Cambia colore tabella riepilogo. Aumenta contatore domanda e carica nuova domanda. Se domande esaurite finisce gioco.
function checkIfRight(inputWord) {
  let selectedRecapListCell = document.getElementById("recapList").getElementsByTagName("ul")[0].getElementsByTagName("li")[currentQuestion];

  if (inputWord == infoQuestions.correctAnswer) {
    currentPoints += 2
    selectedRecapListCell.setAttribute("style","background-color: green;");
  } else { 
    currentPoints--; 
    selectedRecapListCell.setAttribute("style","background-color: red;");
  }
  

  if (currentQuestion == (infoQuestions.questions.length-1)) {
    alert(`domande finite con punteggio ${currentPoints}. Necessario redirect a pagina esterna o costruzione di elemento html nuovo`)
  } else {
  currentQuestion++ ;
  questionBuilder(infoQuestions.questions);
  console.log(currentPoints);
  }
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
      if(document.getElementById(`answer${i}`).innerHTML == infoQuestions.correctAnswer){
        console.log(infoQuestions.correctAnswer);
        document.getElementById("result").innerText = "True"
      }
      break;
    }
  }
} */