/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLOBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game
*/

let scores, roundScore, activePlayer;
const diceUI = document.querySelector('.dice');
const btnHold = document.querySelector('.btn-hold');
const btnRoll = document.querySelector('.btn-roll');

init();

function init() {
  scores = [0, 0];
  activePlayer = 0;
  roundScore = 0;

  diceUI.classList.add('hidden');
  btnHold.classList.add('hidden');
  btnRoll.classList.remove('hidden');

  document.getElementById('score-0').textContent = '0';
  document.getElementById('score-1').textContent = '0';
  document.getElementById('current-0').textContent = '0';
  document.getElementById('current-1').textContent = '0';
  document.getElementById('name-0').textContent = 'Player 1';
  document.getElementById('name-1').textContent = 'Player 2';

  document.querySelector('.player-0-panel').classList.remove('winner');
  document.querySelector('.player-1-panel').classList.remove('winner');
  document.querySelector('.player-0-panel').classList.remove('active');
  document.querySelector('.player-1-panel').classList.remove('active');
  document.querySelector('.player-0-panel').classList.add('active');
}

document.querySelector('.btn-new').addEventListener('click', init);


btnRoll.addEventListener('click', function() {
  
  // random number
  let dice = Math.floor(Math.random() * 6) + 1;
  
  // display the result
  diceUI.src = 'img/dice-' + dice + '.png';
  diceUI.classList.remove('hidden');
  btnHold.classList.remove('hidden');

  // update the round score if the rolled number wasn't 1
  if(dice !== 1) {
    roundScore += dice;
    document.querySelector('#current-' + activePlayer).textContent = roundScore;
  }
  else {
    setTimeout(function() {
      nextPlayer();
    }, 500);
  }
})

btnHold.addEventListener('click', function() {
  // add current score to global score
  scores[activePlayer] += roundScore; 

  // update the UI
  document.getElementById('score-' + activePlayer).textContent = scores[activePlayer];
  
  // check if player won the game
  if(scores[activePlayer] >= 100) {
    document.getElementById('name-' + activePlayer).textContent = 'Winner!';
    document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
    document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');

    diceUI.classList.add('hidden');
    btnHold.classList.add('hidden');
    btnRoll.classList.add('hidden');
  }
  else {
    nextPlayer();
  }
})

function nextPlayer() {
  activePlayer == 0 ? activePlayer = 1 : activePlayer = 0;
  roundScore = 0;

  document.getElementById('current-0').textContent = 0;
  document.getElementById('current-1').textContent = 0;
  document.querySelector('.player-0-panel').classList.toggle('active');
  document.querySelector('.player-1-panel').classList.toggle('active');
  
  diceUI.classList.add('hidden');
}

