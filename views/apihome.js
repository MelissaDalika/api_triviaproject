let currentQuestion = 0;
let infoQuestions = {};
let currentPoints = 0;

//Costructor HTML che richiede lista categoria/id all'API e forma le relative opzioni dentro al form con id "category"

function getCategoryOptions() {
  let categoryArr;
  axios
    .get("https://opentdb.com/api_category.php")
    .then((response) => (categoryArr = response.data.trivia_categories))
    .then(() => console.log(categoryArr))
    .then(() => buildCategoryOptions(categoryArr));
}

function buildCategoryOptions(dataArr) {
  let data = document.getElementById("category");
  data.innerHTML = `<option value="">Any Category</option>`;

  for (let i = 0; i < dataArr.length; i++) {
    data.innerHTML += `<option value=${dataArr[i].id}>${dataArr[i].name}</option>`;
  }
}

//Chiamata della funzione per le opzioni
getCategoryOptions();

//Composizione dell'URL e chiamata all'API con le opzioni come query
function urlComposer() {
  let questionsNbrValue = document.getElementById("questionsNbr").value;
  let categoryValue = document.getElementById("category").value;
  let difficultyValue = document.getElementById("difficulty").value;
  let questionsTypeValue = document.getElementById("questionsType").value;
  let composedUrl = `https://opentdb.com/api.php?amount=${questionsNbrValue}&category=${categoryValue}&difficulty=${difficultyValue}&type=${questionsTypeValue}`;
  document.getElementById("pTest").innerText = composedUrl;
  apiRequest(composedUrl);
}

//Chiamata all'API con ricezione delle domande
function apiRequest(url) {
  axios.get(url).then((response) => {
    infoQuestions.questions = response.data.results;
    questionBuilder(infoQuestions.questions);
    createRecapList();
  });
}

//Creazione della tabella di riepilogo in funzione del n° di domande
function createRecapList() {
  currentQuestion = 0;
  document.getElementById("recapList").innerHTML = ""; //svuota il Div ogni iterazione
  let recapList = document.createElement("ul");
  recapList.setAttribute(
    "class",
    "list-group list-group-horizontal justify-content-center p-4"
  );

  for (let i = 0; i < infoQuestions.questions.length; i++) {
    recapList.innerHTML += `<li class="list-group-item">${i + 1}</li>`;
  }

  document.getElementById("recapList").appendChild(recapList);
}

//Creazione dei Radio contententi le risposte
function questionBuilder(questionArr) {
  infoQuestions.questionText = questionArr[currentQuestion].question;
  infoQuestions.correctAnswer = questionArr[currentQuestion].correct_answer;
  infoQuestions.wrongAnswers = questionArr[currentQuestion].incorrect_answers;
  console.log("questionBuilder sta andando");
  let possibleAnswers = infoQuestions.wrongAnswers.concat(
    infoQuestions.correctAnswer
  );
  shuffle(possibleAnswers);

  document.getElementById("question").innerHTML = infoQuestions.questionText;

  let container = document.getElementById("radiaContainer");
  container.innerHTML = "";
  for (let i = 0; i < possibleAnswers.length; i++) {
    container.innerHTML += `
    <div class="form-check">
    <input type="radio" id="answer${i}" class="radioInput" name="triviaAnswers"   value="${possibleAnswers[i]}">
    <label for="answer${i}" id="answer${i}label">${possibleAnswers[i]}</label>
    </div>`;
  }
}

// Cerca il Radio selezionato e prendine il valore
function getRadioVal() {
  let selectedRadioValue;
  // get list of radio buttons with specified name
  let radiosArr = document.getElementsByClassName("radioInput");

  // loop through list of radio buttons
  for (let i = 0; i < radiosArr.length; i++) {
    if (radiosArr[i].checked) {
      // radio checked?
      console.log("getRadioVal sta andando");
      selectedRadioValue = document.getElementById(`answer${i}label`).innerText; // if so, hold its value in val
      break; // and break out of for loop
    }
  }
  return selectedRadioValue; // return value of checked radio or undefined if none checked
}

//Se risposta giusta aumenta punteggio di 1, altrimenti -1. Cambia colore tabella riepilogo. Aumenta contatore domanda e carica nuova domanda. Se domande esaurite finisce gioco.
function checkIfRight(inputWord) {
  let selectedRecapListCell = document
    .getElementById("recapList")
    .getElementsByTagName("ul")[0]
    .getElementsByTagName("li")[currentQuestion];

  if (inputWord == infoQuestions.correctAnswer) {
    currentPoints += 2;
    selectedRecapListCell.setAttribute("style", "background-color: green;");
  } else if (inputWord == "skip") {
    selectedRecapListCell.setAttribute("style", "background-color: yellow;");
  } else {
    currentPoints--;
    selectedRecapListCell.setAttribute("style", "background-color: red;");
  }

  if (currentQuestion == infoQuestions.questions.length - 1) {
    alert(
      `domande finite con punteggio ${currentPoints}. Necessario redirect a pagina esterna o costruzione di elemento html nuovo`
    );
      window.location.href = `/results.html?result=${currentPoints}`
       
  } else {
    currentQuestion++;
    questionBuilder(infoQuestions.questions);
    console.log(currentPoints);
  }
}

// NEXT CHANCE FOR SKIP QUESTION
let chanceForSkipQuestion = () => {};

//Event Listener BOTTONI
//Bottone conferma risposta
document.getElementById("confirm").addEventListener("click", () => {
  checkIfRight(getRadioVal());
});

document
  .getElementById("urlComposer")
  .addEventListener("click", () => urlComposer());

//Bottone salta domanda
document.getElementById("skip").addEventListener("click", () => {
  checkIfRight("skip");
});

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
