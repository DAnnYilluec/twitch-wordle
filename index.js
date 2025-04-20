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

app.get("/setword", (req, res) => {
    const newWord = req.query.word;
    const user = req.query.user;

    const allowedUsers = ["ItsNa7e", "olli3ver", "nabo_de_dios", "DAnnYilluec"];

    if (!allowedUsers.map(u => u.toLowerCase()).includes(user.toLowerCase())) {
        return res.send("No tienes permiso para cambiar la palabra.");
    }

    if (!newWord || newWord.length !== secretWord.length) {
        return res.send(`La palabra debe tener ${secretWord.length} letras.`);
    }

    secretWord = newWord.toLowerCase();
    return res.send(`Palabra actualizada a "${secretWord}". ¡Que empiece el juego!`);
});


app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
