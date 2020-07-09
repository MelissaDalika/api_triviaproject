//FUNZIONE AUDIO
function playAudio(url) {
  new Audio(url).play();
}


//RICHIESTA DI TIPO GET AL DATABASE
  var data = null;
  
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      let arrData = JSON.parse(this.responseText);
      console.log(arrData);
      tableSxBuilder(arrData);
      cardCenterBuilder(arrData);
    }
  });
  
  xhr.open("GET", "https://trivialapp-043f.restdb.io/rest/punteggio-giocatori");
  xhr.setRequestHeader("content-type", "application/json");
  xhr.setRequestHeader("x-apikey", "5f046bd8a529a1752c476e5d");
  xhr.setRequestHeader("cache-control", "no-cache");
  
  xhr.send(data);

//FUNZIONI CHE USANO LA RICHIESTA GET AL DATABASE  
  let arrayProva = [
  {"_id":"5f04791a498ad7680006e2f2","playerName":"Ciccio","results":10},
  {"_id":"5f047935498ad7680006e2f8","playerName":"Banano","results":50},
  {"_id":"5f048286498ad7680006eba1","playerName":"Giangiulioberto","results":99},
  {"_id":"5f047fb2498ad7680006e947","playerName":"Giangiulioberto","results":99}];
    
    function cardCenterBuilder(arr) {
      arr_id = arr.map(element => element.ID);
      let num = arr_id.indexOf(Math.max(...arr_id));
      document.getElementsByClassName("card-title")[0].innerText = arr[num].playerName;
      document.getElementsByClassName("card-text")[0].innerText = `Il tuo punteggio è stato ${arr[num].results}`;
    }

    function tableSxBuilder(arr) {
        for (let i=0; i < arr.length; i++) {
          document.getElementById("tableSxBody").innerHTML += 
                  `<tr>
                    <th scope="row">${i+1}</th>
                    <td>${arr[i].playerName}</td>
                    <td>${arr[i].results}</td>
                  </tr>`
        }
    }