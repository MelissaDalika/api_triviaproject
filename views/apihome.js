//FUNZIONE AUDIO
let track
function playAudio(url) {
  track = new Audio(url);
  track.play();
  if (url == "https://trivialapp-043f.restdb.io/media/5f06d804498ad76800073f5a"){} else {
  document.getElementById("audioIcon").classList.toggle('audioIconOn');
  sound = true;}
}

let currentQuestion = 0;
let infoQuestions = {}; //raccoglitore di variabili e dati vari
let currentPoints = 0;
let playerName;
let ranked = false;
let sound = false;

//CONTROLLI AUDIO
function audioControls() {
    if (sound) {
      track.pause();
      sound = false;
      document.getElementById("audioIcon").classList.replace('audioIconOn', 'audioIconOff');
    } else {
      track.play();
      sound = true;
      document.getElementById("audioIcon").classList.replace('audioIconOff', 'audioIconOn');
    }
  }
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
  apiRequest(composedUrl);
}

//Chiamata all'API con ricezione delle domande e play audio
function apiRequest(url) {
  axios.get(url).then((response) => {
    infoQuestions.questions = response.data.results;
    questionBuilder(infoQuestions.questions);
    createRecapList();
    playAudio("https://trivialapp-043f.restdb.io/media/5f072f98498ad76800074f52");
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
  recapList.style= "flex-wrap: wrap";
  for (let i = 0; i < infoQuestions.questions.length; i++) {
    recapList.innerHTML += `<li class="list-group-item">${i + 1}</li>`;
  }

  document.getElementById("recapList").appendChild(recapList);
}

//Creazione dei Radio contententi le risposte
function questionBuilder(questionArr) {
  if (questionArr.length == 0){
    alert("Non ci sono abbastanza domande per il Quiz richiesto");
    document.getElementById("optionSelection").classList.toggle('d-none');
    document.getElementById("radiaWrapper").classList.toggle('d-none');
    document.getElementById("buttonWrapper").classList.toggle('d-none');
    document.getElementById("buttonWrapper").classList.toggle('d-flex');
    return

  }else {
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
    selectedRecapListCell.setAttribute("style", "background-color: #43BC77;");
  } else if (inputWord == "skip") {
    selectedRecapListCell.setAttribute("style", "background-color: #ffef5a;");
  } else {
    currentPoints--;
    selectedRecapListCell.setAttribute("style", "background-color: #ff3333;");
  }

  if (currentQuestion == infoQuestions.questions.length - 1) {
    alert(
      `domande finite con punteggio ${currentPoints}. Necessario redirect a pagina esterna o costruzione di elemento html nuovo`
    );

    postData(playerName, currentPoints, ranked);
    //window.location.href = `/results.html?result=${currentPoints}`
       
  } else {
    currentQuestion++;
    questionBuilder(infoQuestions.questions);
    console.log(currentPoints);
  }
}

//Chiamata POST al database
function postData (playerName, score, ranked) {
  var data = JSON.stringify({
    "playerName": playerName,
    "results": score,
    "ranked": ranked
  });
  
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      console.log(this.responseText);
    }
  });
  
  xhr.open("POST", "https://trivialapp-043f.restdb.io/rest/punteggio-giocatori");
  xhr.setRequestHeader("content-type", "application/json");
  xhr.setRequestHeader("x-apikey", "5f046bd8a529a1752c476e5d");
  xhr.setRequestHeader("cache-control", "no-cache");
  
  xhr.send(data);
}

// NEXT CHANCE FOR SKIP QUESTION
let chanceForSkipQuestion = () => {};

//Event Listener BOTTONI

//Bottone Controllo Audio
document.getElementById("audioControls").addEventListener("click", () => audioControls());

//Bottone conferma risposta
document.getElementById("confirm").addEventListener("click", () => {
  checkIfRight(getRadioVal());
});

//Bottone Get Started
document
  .getElementById("urlComposer")
  .addEventListener("click", () => {
    document.getElementById("optionSelection").classList.toggle('d-none');
    document.getElementById("radiaWrapper").classList.toggle('d-none');
    document.getElementById("buttonWrapper").classList.toggle('d-none');
    document.getElementById("buttonWrapper").classList.toggle('d-flex');
    urlComposer()
  });

//Bottone salta domanda
document.getElementById("skip").addEventListener("click", () => {
  checkIfRight("skip");
});
//Bottone invio nome
  document.getElementById("ConfirmName").addEventListener("click", () => {
    document.getElementById("formName").classList.toggle('d-none');
    document.getElementById("formName").classList.toggle('d-flex');
    document.getElementById("optionSelection").classList.toggle('d-none');
    controlInputName ()
    console.log(playerName)
});
//Bottone invio nome Ranked
  document.getElementById("ConfirmNameRanked").addEventListener("click", ()=>{
    document.getElementById("formName").classList.toggle('d-none');
    document.getElementById("formName").classList.toggle('d-flex');
    document.getElementById("radiaWrapper").classList.toggle('d-none');
    document.getElementById("buttonWrapper").classList.toggle('d-none');
    document.getElementById("buttonWrapper").classList.toggle('d-flex');
    controlInputName()
    ranked= true;
    let composedUrl = `https://opentdb.com/api.php?amount=10&difficulty=hard`;
    apiRequest(composedUrl);

  })

//Controllo input nome

function controlInputName (){
    let input = document.getElementById("inputPassword2").value;
    if (!input.replace(/\s/g, '').length) {
      alert('not valid name, replaced with anonymous');
      playerName = "anonymous";
    } else {
      playerName = input;
    }  
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

