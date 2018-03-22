/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

//Function  to setup the game
function setGame() {
  cardsTurned = 0;
  cardsMatched = 0;

  const deck = document.querySelectorAll('li.card');

  //Turn all cards upside down
  deck.forEach(function(elem) {
    elem.setAttribute('class', 'card');
  })

  const deckArr = Array.from(deck);
  const deckShuff = shuffle(deckArr);
  const table = document.querySelector('.deck');
  const timerElem = document.querySelector('.timer');
  const finishPanel = document.querySelector('.finish-panel');

  timerElem.textContent = '00:00';

  if (finishPanel != null) {
    finishPanel.remove();
  }

  table.style.display = 'none';
  table.setAttribute('class', 'deck')
  //Faster remove firstChild variant from Stackoverflow https://stackoverflow.com/a/3955238/9285923
  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }

  for (let value of deckShuff) {
    table.appendChild(value);
  }

  table.style.display = 'flex';

  moves('reset');
  rating('reset');
  started = false;
  timerSecs = 0;
  clearTimeout(timerInterval);

}

let cardsTurned = 0;
let cardsMatched = 0;
let card1;
let card2;
let started = false;
let timerInterval;

//Card turning function
function turnCard(evt) {
  if (!started) {
    started = true;
    timerInterval = setInterval(timer, 1000);
  }

  const classes = evt.target.classList;
  const nodeName = evt.target.nodeName;
  const firtsClass = classes.item(1);

  if (nodeName === 'LI' && firtsClass != 'match' && firtsClass != 'open' && cardsTurned === 0) {
    cardsOpen(classes);
    cardsTurned++;
    card1 = evt.target;
  }
  else if (nodeName === 'LI' && firtsClass != 'match' && firtsClass != 'open' && cardsTurned === 1) {
    cardsOpen(classes);
    cardsTurned++;
    moves();
    card2 = evt.target;
    resetStop = true;
    eval(card1, card2);
    cardsTurned = 0;
  }
}

//Function to turn the cards around
function cardsOpen(classes) {
  classes.toggle('open');
}

//Function to flip cards upside down again
function cardsClose(classes) {
  classes.toggle('open');
  classes.toggle('close');

  setTimeout(function() {
    classes.toggle('close');
  }, 850)
}

//Function to compare the cards
function eval(cardOne, cardTwo) {
  const cardOneClass = cardOne.childNodes[1].classList[1]
  const cardTwoClass = cardTwo.childNodes[1].classList[1]
  const cardOneClassList = cardOne.classList
  const cardTwoClassList = cardTwo.classList

  if (cardOneClass === cardTwoClass) {
    stopTime = 1100;

    setTimeout(function() {
      cardsOpen(cardOneClassList);
      cardsOpen(cardTwoClassList);
      cardOneClassList.toggle('match');
      cardTwoClassList.toggle('match');
      cardsMatched++;

      if (cardsMatched == 8) {
        setTimeout(function() {
          finished();
        }, 900)

      }

      resetStop = false;
    }, 900)
  }
  else {
    stopTime = 1400;
    setTimeout(function() {
      cardsClose(cardOneClassList);
      cardsClose(cardTwoClassList);
      resetStop = false;
    }, 1100)
  }
}


/** A function to control the move counter
 *   Operation parameter accepts 'reset' to reset the counter
 **/
function moves(operation) {
  const moveElem = document.querySelector('.moves');
  let moveCount = moveElem.textContent;

  if (operation == 'reset') {
    moveElem.textContent = 0;
  }
  else {
    if (moveCount == 13 || moveCount == 27) {
      rating();
    }

    moveCount = Number(moveCount);
    moveCount++;

    moveElem.textContent = moveCount;
  }

}

/** Function to decrease the rating
 *   Operation parameter accepts 'reset'  to reset the rating
 **/

function rating(operation) {
  const ratingElem = document.querySelector('.stars');

  if (operation == 'reset') {
    const starHtml = '<i class="fa fa-star"></i>';
    const starCount = document.getElementsByClassName('fa-star').length;

    for (let i = starCount; i < 3; i++) {
      let newStar = document.createElement('li');
      newStar.innerHTML = starHtml;
      ratingElem.appendChild(newStar);
    }
  }
  else {
    ratingElem.removeChild(ratingElem.children[0]);
  }
}

//Function for when the game is finished
function finished() {
  const timeNeeded = document.querySelector('.timer').textContent;
  const minutes = timeNeeded.slice(1, 2);
  const seconds = timeNeeded.slice(3, 5);
  const rating = document.getElementsByClassName('fa-star').length;
  const deck = document.querySelector('.deck');
  const container = document.querySelector('.container');
  const finishPanel = document.createElement('div');
  const paragraph = document.createElement('p');
  const tryAgainButton = document.createElement('button');
  const moves = document.querySelector('.moves').textContent;

  clearTimeout(timerInterval);

  finishPanel.setAttribute('class', 'finish-panel');
  tryAgainButton.setAttribute('class', 'try-again-button');
  paragraph.setAttribute('class', 'finish-panel-text');

  tryAgainButton.textContent = 'Try Again';
  paragraph.textContent = `Congratulations! You finished the game with only ${moves} moves
                          in ${minutes} minutes and ${seconds} seconds. You have a rating of
                          ${rating} stars!`;

  finishPanel.appendChild(paragraph);
  finishPanel.appendChild(tryAgainButton);
  setTimeout(function() {
    container.appendChild(finishPanel);
    tryAgainButton.addEventListener('click', setGame);
  }, 300)

  deck.classList.add('finished');
}

//The function which controls the timer
let timerSecs = 0;

function timer() {
  timerSecs++;

  const minutes = Math.floor(timerSecs / 60);
  const realSec = timerSecs - minutes * 60;

  //Got this code idea from https://stackoverflow.com/a/8043061/9285923
  const formattedMinutes = ("0" + minutes).slice(-2);
  const formattedSecs = ("0" + realSec).slice(-2);

  const timerElem = document.querySelector('.timer');
  timerElem.textContent = formattedMinutes + ':' + formattedSecs;
}

//Event for the restart button
let resetStop = false;
let stopTime;

const restartButton = document.querySelector('.restart');
restartButton.addEventListener('click', function() {
  if (resetStop) {
    setTimeout(setGame, stopTime);
  }
  else {
    setGame();
  }
})

//Event for clicking on the cards
const cardDeck = document.getElementsByClassName('deck')[0];
cardDeck.addEventListener('click', turnCard);

setGame();
/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
