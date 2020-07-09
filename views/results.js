//FUNZIONE AUDIO
function playAudio(url) {
  new Audio(url).play();
}


//RICHIESTA DI TIPO GET AL DATABASE per costruzione card centrale
function getPlayerData() {
  var data = null;
  
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      let arrData = JSON.parse(this.responseText);
      console.log(arrData);
      cardCenterBuilder(arrData);
    }
  });
  
  xhr.open("GET", "https://trivialapp-043f.restdb.io/rest/punteggio-giocatori");
  xhr.setRequestHeader("content-type", "application/json");
  xhr.setRequestHeader("x-apikey", "5f046bd8a529a1752c476e5d");
  xhr.setRequestHeader("cache-control", "no-cache");
  
  xhr.send(data);
}
//RICHIESTA DI TIPO GET AL DATABASE per costruzione classifica laterale
function getRankedScores() {
var data = null;
  
var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === 4) {
    let arrData = JSON.parse(this.responseText);
    console.log(arrData);
    tableSxBuilder(arrData);
  }
});

xhr.open("GET", "https://trivialapp-043f.restdb.io/rest/punteggio-giocatori?q={%22ranked%22:true}&h={%22$orderby%22:%20{%22results%22:%20-1}}");
xhr.setRequestHeader("content-type", "application/json");
xhr.setRequestHeader("x-apikey", "5f046bd8a529a1752c476e5d");
xhr.setRequestHeader("cache-control", "no-cache");

xhr.send(data);
}


//FUNZIONI CHE USANO LA RICHIESTA GET AL DATABASE  
      function cardCenterBuilder(arr) {
        arr_id = arr.map(element => element.ID);
        let num = arr_id.indexOf(Math.max(...arr_id));
        document.getElementsByClassName("card-title")[0].innerText = arr[num].playerName;
        document.getElementsByClassName("card-text")[0].innerText = `Il tuo punteggio è stato ${arr[num].results}`;
      }

    function tableSxBuilder(arr) {
      let stopNumber = arr.length -1
        for (let i=0; i < 10; i++) {
          if ( stopNumber == i) {
            break
          }
          document.getElementById("tableSxBody").innerHTML += 
                  `<tr>
                    <th scope="row">${i+1}</th>
                    <td>${arr[i].playerName}</td>
                    <td>${arr[i].results}</td>
                  </tr>`
        }
    }

  getPlayerData();
  getRankedScores();