// Wordle logic
let wordList = [];
let targetWord = "";
let attempts = 0;

const grid = document.getElementById("grid");
const guessInput = document.getElementById("guess-input");
const submitGuess = document.getElementById("submit-guess");
const feedback = document.getElementById("feedback");

// Fetch word list and initialize target word
fetch("wordlist.txt")
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to load word list.");
        }
        return response.text();
    })
    .then(data => {
        wordList = data.split("\n").map(word => word.trim());
        if (wordList.length > 0) {
            targetWord = wordList[Math.floor(Math.random() * wordList.length)];
            console.log("Target word selected:", targetWord); // For debugging
        } else {
            feedback.textContent = "Word list is empty. Please check the file.";
        }
    })
    .catch(error => {
        console.error("Error loading word list:", error);
        feedback.textContent = "Failed to load word list.";
    });

// Initialize grid
for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 5; j++) {
        const cell = document.createElement("div");
        cell.id = `cell-${i}-${j}`;
        grid.appendChild(cell);
    }
}

// Handle guess submission
submitGuess.addEventListener("click", () => {
    if (!targetWord) {
        feedback.textContent = "Game not ready. Please wait for the word list to load.";
        return;
    }

    const guess = guessInput.value.toLowerCase();
    feedback.textContent = ""; // Clear feedback messages

    // Validate word length
    if (guess.length !== 5) {
        feedback.textContent = "Guess must be a 5-letter word!";
        return;
    }

    // Validate characters
    if (!/^[a-zA-Z]+$/.test(guess)) {
        feedback.textContent = "Guess can only contain letters!";
        return;
    }

    // Proceed with game logic
    console.log(`Guess: ${guess}`);
    const row = Math.min(attempts, 5);

    for (let i = 0; i < 5; i++) {
        const cell = document.getElementById(`cell-${row}-${i}`);
        cell.textContent = guess[i];

        if (guess[i] === targetWord[i]) {
            cell.classList.add("correct");
        } else if (targetWord.includes(guess[i])) {
            cell.classList.add("misplaced");
        } else {
            cell.classList.add("incorrect");
        }
    }

    attempts++;

    if (guess === targetWord) {
        feedback.textContent = "You guessed the word! 🎉";
        guessInput.disabled = true;
        submitGuess.disabled = true;
    } else if (attempts === 6) {
        feedback.textContent = `Game over! The word was ${targetWord}.`;
    }

    guessInput.value = ""; // Clear input box
});
