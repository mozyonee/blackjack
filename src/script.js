Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
}

function sumArray(arr) {
    return arr.reduce((a, b) => a + b, 0);
}

function giveCard(arr) {
    let idx = Math.floor(Math.random() * cards.length);
    arr.push(cards[idx]);
    cards.splice(idx, 1);
}

function updateScore(arr, scr, card, html) {
    let add;
    switch(arr[card][0]) {
        case "1": case "j": case "q": case "k": add = 10; break;
        case "a": sumArray(scr) <= 10 ? add = 11 : add = 1; break;
        default: add = parseInt(arr[card]);
    }
    scr.push(add);
    let img = document.createElement("img");
    img.src = `./img/${arr[card]}.png`;
    html.appendChild(img);
}

function recharge() {
    sessionStorage.setItem("balance", document.getElementById("recharge").value);
    balance.innerHTML = parseInt(sessionStorage.getItem("balance"));
}

const buttons = document.getElementsByTagName("button");
const player = document.getElementById("player");
const dealer = document.getElementById("dealer");
const hit = document.getElementById("hit");
const stand = document.getElementById("stand");
const result = document.getElementById("result");

const cards = [
    "2h", "3h", "4h", "5h", "6h", "7h", "8h", "9h", "1h", "jh", "qh", "kh", "ah",
    "2d", "3d", "4d", "5d", "6d", "7d", "8d", "9d", "1d", "jd", "qd", "kd", "ad",
    "2c", "3c", "4c", "5c", "6c", "7c", "8c", "9c", "1c", "jc", "qc", "kc", "ac",
    "2s", "3s", "4s", "5s", "6s", "7s", "8s", "9s", "1s", "js", "qs", "ks", "as"
];

let betAmount;

let playerCards = [];
let dealerCards = [];

let playerScore = [];
let dealerScore = [];

let balanceAmount = parseInt(sessionStorage.getItem("balance"))

if(!balanceAmount || balanceAmount <= 0) {
    balanceAmount = 5000;
    sessionStorage.setItem("balance", balanceAmount);
}

while(true) {
    betAmount = parseInt(prompt("place a bet. balance: " + balanceAmount));
    if(betAmount > 0 && betAmount <= balanceAmount) break;
}

balanceAmount -= betAmount;
sessionStorage.setItem("balance", balanceAmount);

giveCard(playerCards);
giveCard(playerCards);
giveCard(dealerCards);
giveCard(dealerCards);

for(let i = 0; i < playerCards.length; i++) updateScore(playerCards, playerScore, i, player);
for(let i = 0; i < dealerCards.length; i++) updateScore(dealerCards, dealerScore, i, dealer);

if(sumArray(playerScore) == 21 && sumArray(dealerScore) == 21) {
    for(let i = 0; i < buttons.length; i++) buttons[i].disabled = true;
    dealer.firstChild.style.filter = "brightness(1)";
    sessionStorage.setItem("balance", balanceAmount + betAmount);
    result.innerHTML = "you drew with getting 21";
    setInterval(function() { location.reload(); }, 5000);
} else if(sumArray(playerScore) == 21) {
    for(let i = 0; i < buttons.length; i++) buttons[i].disabled = true;
    dealer.firstChild.style.filter = "brightness(1)";
    sessionStorage.setItem("balance", balanceAmount + betAmount * 2.5);
    result.innerHTML = `you won ${betAmount} with getting 21 first`;
    setInterval(function() { location.reload(); }, 5000);
} else if(sumArray(dealerScore) == 21) {
    for(let i = 0; i < buttons.length; i++) buttons[i].disabled = true;
    dealer.firstChild.style.filter = "brightness(1)";
    result.innerHTML = `you lost ${betAmount} with dealer getting 21 first`;
    setInterval(function() { location.reload(); }, 5000);
}

function actHit() {
    giveCard(playerCards);
    updateScore(playerCards, playerScore, playerCards.length - 1, player);

    if(sumArray(playerScore) > 21) {
        for(let i = 0; i < buttons.length; i++) buttons[i].disabled = true;
        dealer.firstChild.style.filter = "brightness(1)";
        result.innerHTML = `you lost ${betAmount} with ${sumArray(playerScore)} versus dealer's ${sumArray(dealerScore)}`;				
        setInterval(function() { location.reload(); }, 2500);
    } else if(sumArray(playerScore) == 21) {
        for(let i = 0; i < buttons.length; i++) buttons[i].disabled = true;
        dealer.firstChild.style.filter = "brightness(1)";
        sessionStorage.setItem("balance", balanceAmount + betAmount * 2);
        result.innerHTML = `you won ${betAmount} with ${sumArray(playerScore)} versus dealer's ${sumArray(dealerScore)}`;				
        setInterval(function() { location.reload(); }, 2500);
    }
}

function actStand() {
    dealer.firstChild.style.filter = "brightness(1)";

    while(sumArray(dealerScore) < sumArray(playerScore) && sumArray(playerScore) < 21) {
        giveCard(dealerCards);
        updateScore(dealerCards, dealerScore, dealerCards.length - 1, dealer);
    }

    if(sumArray(dealerScore) <= 21 && sumArray(dealerScore) > sumArray(playerScore)) {
        for(let i = 0; i < buttons.length; i++) buttons[i].disabled = true;
        result.innerHTML = `you lost ${betAmount} with ${sumArray(playerScore)} versus dealer's ${sumArray(dealerScore)}`;
        setInterval(function() { location.reload(); }, 5000);
    } else if(sumArray(dealerScore) > 21 || sumArray(dealerScore) < sumArray(playerScore)) {
        for(let i = 0; i < buttons.length; i++) buttons[i].disabled = true;
        sessionStorage.setItem("balance", balanceAmount + betAmount * 2);
        result.innerHTML = `you won ${betAmount} with ${sumArray(playerScore)} versus dealer's ${sumArray(dealerScore)}`;
        setInterval(function() { location.reload(); }, 5000);
    } else {				
        for(let i = 0; i < buttons.length; i++) buttons[i].disabled = true;
        sessionStorage.setItem("balance", balanceAmount + betAmount);
        result.innerHTML = `you drew with ${sumArray(playerScore)} versus dealer's ${sumArray(dealerScore)}`;
        setInterval(function() { location.reload(); }, 5000);
    }
}