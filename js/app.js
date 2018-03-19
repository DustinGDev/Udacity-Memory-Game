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
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function setGame(){
    var t0 = performance.now();
    const deck = document.querySelectorAll('li.card');

    //Turn all cards around 
    deck.forEach(function(elem){
      elem.setAttribute('class', 'card');
    })

    const deckArr = Array.from(deck);
    const deckShuff = shuffle(deckArr);
    const table = document.querySelector('.deck');

    table.style.display = 'none';

    //Faster remove firstChild variant from Stackoverflow https://stackoverflow.com/a/3955238/9285923
    while (table.firstChild) {
      table.removeChild(table.firstChild);
    }

    for (i = 0; i < deckShuff.length; i++ ){
      table.appendChild(deckShuff[i]);
    }

    table.style.display = 'flex';

    var t1 = performance.now();
    console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.");
}

//Event for the restart button
const restartButton = document.querySelector('.restart');
restartButton.addEventListener('click', setGame);



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
