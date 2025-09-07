document.addEventListener('DOMContentLoaded', () => {
    let secretWord;
    let selectedWordLength;
    const words = [
        "APPLE", "PEACE", "CANDY", "LIGHT", "HOUSE", "WATER", "PHONE", "TABLE", "CHAIR", "DREAM",
        "HAPPY", "GREEN", "TIGER", "OCEAN", "MUSIC", "BRAIN", "CLOUD", "POWER", "FRESH", "GLOW",
        "BEAUTY", "SILVER", "JOURNEY", "FANTASY", "WONDER", "EXPLORE", "MYSTERY", "ADVENTURE"
    ];

    // Landing Page Elements
    const landingPage = document.getElementById('landingPage');
    const playerNameInput = document.getElementById('playerName');
    const wordLengthSelect = document.getElementById('wordLength');
    const startButton = document.getElementById('startButton');

    // Game Page Elements
    const gamePage = document.getElementById('gamePage');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const guessInput = document.getElementById('guessInput');
    const guessButton = document.getElementById('guessButton');
    const resetButton = document.getElementById('resetButton');
    const messageDisplay = document.getElementById('message');
    const correctPositionDisplay = document.getElementById('correctPosition');
    const correctWrongPositionDisplay = document.getElementById('correctWrongPosition');
    const wordLengthHint = document.getElementById('wordLengthHint');
    const guessesList = document.getElementById('guessesList');

    function selectNewWord(length) {
        const filteredWords = words.filter(word => word.length === length);
        if (filteredWords.length === 0) {
            alert('Maaf, tidak ada kata dengan jumlah huruf tersebut. Silakan pilih level lain.');
            return;
        }
        secretWord = filteredWords[Math.floor(Math.random() * filteredWords.length)];
        wordLengthHint.textContent = `Kata ini memiliki ${secretWord.length} huruf.`;
        guessInput.setAttribute('maxlength', secretWord.length);
        console.log("Kata rahasia:", secretWord);
    }

    function addGuessToList(guess, correctInPlace, correctWrongPlace) {
        const guessItem = document.createElement('div');
        guessItem.classList.add('guess-item');
        
        const guessWord = document.createElement('span');
        guessWord.classList.add('guess-word');
        guessWord.textContent = guess;
        
        const guessFeedback = document.createElement('span');
        guessFeedback.classList.add('guess-feedback');
        guessFeedback.innerHTML = `✅ ${correctInPlace} &nbsp; 🟡 ${correctWrongPlace}`;
        
        guessItem.appendChild(guessWord);
        guessItem.appendChild(guessFeedback);
        
        guessesList.prepend(guessItem);
    }

    function checkGuess() {
        const guess = guessInput.value.trim().toUpperCase();

        if (guess.length !== secretWord.length) {
            messageDisplay.textContent = `Tebakan harus ${secretWord.length} huruf!`;
            return;
        }

        if (guess === secretWord) {
            messageDisplay.textContent = '🥳 Selamat! Tebakanmu benar!';
            addGuessToList(guess, secretWord.length, 0);
            guessInput.value = '';
            guessButton.disabled = true;
            resetButton.style.display = 'block';
            return;
        }

        let correctInPlace = 0;
        let correctWrongPlace = 0;
        let tempSecretWord = secretWord.split('');
        let tempGuess = guess.split('');

        for (let i = 0; i < secretWord.length; i++) {
            if (i < guess.length && tempGuess[i] === tempSecretWord[i]) {
                correctInPlace++;
                tempSecretWord[i] = null;
                tempGuess[i] = null;
            }
        }

        for (let i = 0; i < guess.length; i++) {
            if (tempGuess[i] !== null) {
                const secretIndex = tempSecretWord.indexOf(tempGuess[i]);
                if (secretIndex !== -1) {
                    correctWrongPlace++;
                    tempSecretWord[secretIndex] = null;
                }
            }
        }

        messageDisplay.textContent = 'Tebakanmu salah.';
        correctPositionDisplay.textContent = `✅ Huruf benar di posisi yang tepat: ${correctInPlace}`;
        correctWrongPositionDisplay.textContent = `🟡 Huruf benar di posisi yang salah: ${correctWrongPlace}`;
        
        addGuessToList(guess, correctInPlace, correctWrongPlace);
        guessInput.value = '';
    }

    function resetGame() {
        messageDisplay.textContent = '';
        correctPositionDisplay.textContent = '';
        correctWrongPositionDisplay.textContent = '';
        guessesList.innerHTML = '';
        guessButton.disabled = false;
        resetButton.style.display = 'none';
        
        selectNewWord(parseInt(selectedWordLength));
    }

    startButton.addEventListener('click', () => {
        const playerName = playerNameInput.value.trim();
        if (playerName === '') {
            alert('Silakan masukkan namamu untuk memulai!');
            return;
        }

        selectedWordLength = parseInt(wordLengthSelect.value);

        landingPage.classList.add('hidden');
        gamePage.classList.remove('hidden');

        welcomeMessage.textContent = `Hai, ${playerName}! Selamat datang!`;
        selectNewWord(selectedWordLength);
    });

    guessButton.addEventListener('click', checkGuess);
    guessInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkGuess();
        }
    });
    resetButton.addEventListener('click', resetGame);
});