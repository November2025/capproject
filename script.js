const board = document.getElementById('game-board');
const timerElement = document.getElementById('timer');
const cardImages = [];
const numPairs = 6;
let card1, card2;
let lockBoard = false;
let matchedCards = 0;
let timer;
let seconds = 120;

// Fetch cat images from an API
async function fetchCatImages() {
    const response = await fetch('https://api.thecatapi.com/v1/images/search?limit=' + numPairs * 2);
    const data = await response.json();
    return data.map(item => item.url);
}

// Initialize the game
async function initGame() {
    const images = await fetchCatImages();
    const shuffledImages = [...images, ...images].sort(() => Math.random() - 0.5);
    board.innerHTML = '';
    cardImages.length = 0;

    shuffledImages.forEach((image, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.image = image;

        const img = document.createElement('img');
        img.src = image;
        card.appendChild(img);

        card.addEventListener('click', () => flipCard(card));
        board.appendChild(card);

        cardImages.push(card);
    });

    startTimer();
}

// Flip card
function flipCard(card) {
    if (lockBoard || card === card1 || card.classList.contains('matched')) return;

    card.classList.add('flipped');

    if (!card1) {
        card1 = card;
    } else {
        card2 = card;
        checkForMatch();
    }
}

// Check if cards match
function checkForMatch() {
    if (card1.dataset.image === card2.dataset.image) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedCards += 2;

        if (matchedCards === cardImages.length) {
            clearInterval(timer);
            alert('Congratulations! You won!');
        }

        resetBoard();
    } else {
        lockBoard = true;
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            resetBoard();
        }, 1000);
    }
}

// Reset board
function resetBoard() {
    [card1, card2, lockBoard] = [null, null, false];
}

// Start the timer
function startTimer() {
    timer = setInterval(() => {
        seconds--;
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        timerElement.textContent = `Time: ${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

        if (seconds <= 0) {
            clearInterval(timer);
            alert('Time\'s up! Game over.');
            initGame();
        }
    }, 1000);
}

// Initialize the game on page load
initGame();
