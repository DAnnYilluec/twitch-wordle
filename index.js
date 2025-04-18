const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

let secretWord = "casa";

function checkGuess(guess, word) {
    guess = guess.toLowerCase();
    word = word.toLowerCase();
    let result = "";

    for (let i = 0; i < word.length; i++) {
        if (guess[i] === word[i]) {
            result += "🟩";
        } else if (word.includes(guess[i])) {
            result += "🟨";
        } else {
            result += "⬛";
        }
    }
    return result;
}

app.get("/guess", (req, res) => {
    const user = req.query.user;
    const guess = req.query.word;

    if (!guess || guess.length !== secretWord.length) {
        return res.send(`${user}, la palabra debe tener ${secretWord.length} letras.`);
    }

    const result = checkGuess(guess, secretWord);

    if (guess.toLowerCase() === secretWord.toLowerCase()) {
        return res.send(`¡${user} adivinó la palabra! Era "${secretWord}".`);
    }

    return res.send(`${user}: ${result}`);
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
