let cardRevealed = false;
let lastElement = null;
let lastElementClass = null;
let deckSize = null;
let deckPlayed = null;
let chronometer = null;
let cardCounter = 0;
let gameStop = 0;
let timer = 0;
let playedCard = [];
//asks the user for the deck size to be played
function gameLoad() {
  deckSize = 0;

  do {
    deckSize = prompt("Insira a quantidade de cartas que deseja jogar, entre 4 e 14 (Números pares apenas)");
  } while (deckSize < 4 || deckSize > 14 || deckSize % 2 != 0);

  chronometer = setInterval(gameTimer, 1000);
  //Fischer-Yates random sorting algorithm
  function shuffle(array) {
    let i = array.length,
      k,
      j;

    while (0 !== i) {
      j = Math.floor(Math.random() * i);
      i -= 1;
      k = array[i];
      array[i] = array[j];
      array[j] = k;
    }
    return array;
  }
  //creates an array with all the possible faces
  const deckStack = ["parrot-bob", "parrot-explody", "parrot-fiesta", "parrot-metal", "parrot-captain", "parrot-triplet", "parrot-unicorn"];

  shuffle(deckStack);
  //deckStack array spliced to form a new array with desired deck size
  deckPlayed = deckStack.splice(0, deckSize / 2);
  //display all selected cards on screen
  for (let i = 0; i < deckPlayed.length; i++) {
    const element = document.getElementsByClassName(deckPlayed[i]);

    for (let i = 0; i < element.length; i++) {
      element[i].classList.add("card-played");
    }
  }
  //shuffles all cards currently displayed
  const gameContainer = document.querySelector(".game-container");
  const children = [...gameContainer.children];

  shuffle(children);

  for (const child of children) {
    gameContainer.appendChild(child);
  }
}

//starts chronometer
function gameTimer() {
  timer++;

  document.getElementById("timer").innerHTML = timer;
}

//when called will flip a card
function cardDisplay(element) {
  element.childNodes[1].classList.add("card-front-flip");
  element.childNodes[3].classList.add("card-back-flip");
}
//displays end game mensage and reset prompt
function gameEnd() {
  alert(`Você ganhou em ${cardCounter} jogadas! A duração do jogo foi de ${timer} segundos!`);

  let reset = prompt("Você gostaria de reiniciar a partida? (sim ou não)");

  if (reset == "sim") {
    for (let i = 0; i < deckPlayed.length; i++) {
      const element = document.getElementsByClassName(deckPlayed[i]);

      for (let i = 0; i < element.length; i++) {
        element[i].classList.remove("card-played");
        element[i].childNodes[1].classList.remove("card-front-flip");
        element[i].childNodes[3].classList.remove("card-back-flip");
      }
    }

    document.getElementById("timer").innerHTML = "0";
    
    clearInterval(chronometer);
    
    playedCard = [];
    cardRevealed = false;
    lastElement = null;
    lastElementClass = null;
    cardCounter = 0;
    gameStop = 0;
    timer = 0;
    
    gameLoad();
  } else {
    clearInterval(chronometer);
  }
}
//core gameplay function, handles card flip and unflip logic
function cardSelector(element, elementClass) {
  if (cardRevealed === false && !playedCard.includes(elementClass)) {
    cardDisplay(element);

    playedCard.push(elementClass);

    cardRevealed = true;
    lastElement = element;
    lastElementClass = elementClass;
    cardCounter++;
  } else if (cardRevealed === true && elementClass === lastElementClass && element !== lastElement) {
    cardDisplay(element);

    cardRevealed = false;
    cardCounter++;
    gameStop++;

    if (gameStop == deckPlayed.length) {
      setTimeout(gameEnd, 1000);
    } else {
      null;
    }
  } else if (cardRevealed === true && elementClass !== lastElementClass && !playedCard.includes(elementClass)) {
    cardDisplay(element);

    playedCard.pop();

    cardRevealed = false;
    lastElementClass = null;
    cardCounter++;

    document.addEventListener("click", disableClick, true);

    function disableClick(e) {
      e.stopPropagation();
      e.preventDefault();
    }

    function cardHide() {
      element.childNodes[1].classList.remove("card-front-flip");
      element.childNodes[3].classList.remove("card-back-flip");
      lastElement.childNodes[1].classList.remove("card-front-flip");
      lastElement.childNodes[3].classList.remove("card-back-flip");
    }

    function restoreClick() {
      document.removeEventListener("click", disableClick, true);
    }

    setTimeout(cardHide, 1000);
    setTimeout(restoreClick, 1000);
  } else {
    null;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  gameLoad();
});
