Array.prototype.random = function() {
	return this[Math.floor(Math.random() * this.length)];
};

function score(arr) {
	return arr.reduce((sum, el) => el.hidden ? sum : sum + el.value, 0);
}

function addCardToHand(scoreArray, handElement, hidden = false) {
    const idx = Math.floor(Math.random() * cards.length);
    const card = cards.splice(idx, 1)[0];
    const value = getCardValue(card, score(scoreArray));

    scoreArray.push({ card: card, value: value, hidden: hidden });
	adjustAces(scoreArray);
	
    displayCard(card, handElement, hidden);
    updateScoreDisplay();
}

function getCardValue(card, currentScore) {
	const rank = card[0];
	if (rank === "a") return currentScore <= 10 ? 11 : 1;
	if (["1", "j", "q", "k"].includes(rank)) return 10;
	return parseInt(rank);
}

function adjustAces(scoreArray) {
    while (score(scoreArray) > 21) {
        const ace = scoreArray.find(card => card.value === 11);
        if (ace) ace.value = 1;
        else break;
    }
}

function displayCard(card, handElement, hidden) {
    const img = document.createElement("img");
    if (hidden) {
        img.src = './img/back.png';
        img.classList.add("card");
    } else {
        img.src = `./img/${card}.png`;
        img.classList.add("card");
    }
    handElement.appendChild(img);
}


function updateScoreDisplay() {
	document.getElementById("dealerScore").innerText = `Dealer: ${score(dealerHand)}`;
	document.getElementById("playerScore").innerText = `Player: ${score(playerHand)}`;
}

const balanceElem = document.getElementById("balance");
const playerElem = document.getElementById("player");
const dealerElem = document.getElementById("dealer");
const hitBtn = document.getElementById("hit");
const standBtn = document.getElementById("stand");
const restartBtn = document.getElementById("restart");
const resultElem = document.getElementById("result");
const controlDiv = document.getElementById("control");

let balance = parseInt(sessionStorage.getItem("balance")) || 5000;
balanceElem.innerHTML = `$${balance}`;
let betAmount, playerHand = [], dealerHand = [];
let dealerHasBlackjack = false;
const cards = [
	"2h", "3h", "4h", "5h", "6h", "7h", "8h", "9h", "1h", "jh", "qh", "kh", "ah",
	"2d", "3d", "4d", "5d", "6d", "7d", "8d", "9d", "1d", "jd", "qd", "kd", "ad",
	"2c", "3c", "4c", "5c", "6c", "7c", "8c", "9c", "1c", "jc", "qc", "kc", "ac",
	"2s", "3s", "4s", "5s", "6s", "7s", "8s", "9s", "1s", "js", "qs", "ks", "as"
];

function initializeGame() {
	restartBtn.style.display = 'none';

	do {
		betAmount = parseInt(prompt(`Place a bet. Balance: ${balance}`));
	} while (isNaN(betAmount) || betAmount <= 0 || betAmount > balance);

	balance -= betAmount;
	sessionStorage.setItem("balance", balance);
	balanceElem.innerHTML = `$${balance}`;

	playerHand = [];
	dealerHand = [];
	playerElem.innerHTML = '';
	dealerElem.innerHTML = '';
	resultElem.innerHTML = '';

	addCardToHand(playerHand, playerElem);
	addCardToHand(playerHand, playerElem);
	addCardToHand(dealerHand, dealerElem, true);
	addCardToHand(dealerHand, dealerElem);

	if (score(playerHand) === 21) endGame("win", betAmount * 2);
	else {
		hitBtn.style.display = 'inline-block';
		standBtn.style.display = 'inline-block';
	}
}

function playerTurn() {
	addCardToHand(playerHand, playerElem);
	if (score(playerHand) >= 21) checkWinner();
}

function dealerTurn() {

	hitBtn.style.display = 'none';
	standBtn.style.display = 'none';
    
    dealerElem.children[0].src = `./img/${dealerHand[0].card}.png`;
    dealerHand[0].hidden = false;
    updateScoreDisplay();

	if(score(dealerHand) >= score(playerHand)) checkWinner()
	else {
		function drawDealerCard() {
			if(score(dealerHand) >= score(playerHand)) checkWinner();
			else {
				addCardToHand(dealerHand, dealerElem);
				if(score(dealerHand) >= score(playerHand)) checkWinner();
				else setTimeout(drawDealerCard, 1000);
			}
		}
	
		setTimeout(drawDealerCard, 1000);
	}
}

function checkWinner() {
    const playerSum = score(playerHand);
    const dealerSum = score(dealerHand);
    if (playerSum > 21) endGame("lose", 0);
	else if (dealerSum > 21) endGame("win", betAmount * 2);
    else if (playerSum > dealerSum) endGame("win", betAmount * 2);
    else if (playerSum < dealerSum) endGame("lose", 0);
    else if (playerSum === dealerSum) endGame("draw", betAmount);
}

function endGame(result, payout) {
	hitBtn.style.display = 'none';
	standBtn.style.display = 'none';

	balance += payout;
	if(balance <= 0) balance = 5000;
	sessionStorage.setItem("balance", balance);
	balanceElem.innerHTML = `$${balance}`;

	if (result === "win") {
		resultElem.style.color = '#34eb34';
		resultElem.innerHTML = `You won $${payout - betAmount}!`;
	} else if (result === "draw") {
		resultElem.style.color = '#ebebeb';
		resultElem.innerHTML = "It's a draw!";
	} else {
		resultElem.style.color = '#eb4034';
		resultElem.innerHTML = `You lost $${betAmount}!`;
	}

	restartBtn.style.display = 'inline-block';
}

initializeGame();