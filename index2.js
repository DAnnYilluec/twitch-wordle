const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

function generarCarta() {
    const valores = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    const palos = ["♠️", "♥️", "♦️", "♣️"];
    const valor = valores[Math.floor(Math.random() * valores.length)];
    const palo = palos[Math.floor(Math.random() * palos.length)];
    return `${valor}${palo}`;
  }
  
  function calcularTotal(cartas) {
    let total = 0;
    let ases = 0;
  
    for (let carta of cartas) {
        let valor = carta.match(/^[A-Z0-9]+/)[0];

        // quita el palo
  
      if (["J", "Q", "K"].includes(valor)) {
        total += 10;
      } else if (valor === "A") {
        ases += 1;
        total += 11;
      } else {
        total += parseInt(valor);
      }
    }
  
    // Ajuste por ases (si pasamos de 21)
    while (total > 21 && ases > 0) {
      total -= 10;
      ases -= 1;
    }
  
    return total;
  }
  const partidas = {};
// Funciones: generarCarta y calcularTotal van aquí ⬆️

app.get("/blackjack", (req, res) => {
    const user = req.query.user?.toLowerCase();
  
    if (!user) return res.send("Falta el nombre del usuario.");
  
    // Si ya tiene una partida activa
    if (partidas[user] && !partidas[user].terminado) {
      return res.send(`${user}, ya tienes una partida activa. Usa !pedir o !plantar.`);
    }
  
    const carta1 = generarCarta();
    const carta2 = generarCarta();
    const cartas = [carta1, carta2];
    const total = calcularTotal(cartas);
  
    partidas[user] = {
      cartasJugador: cartas,
      totalJugador: total,
      terminado: false
    };
  
    if (total === 21) {
      partidas[user].terminado = true;
      return res.send(`¡${user}, tu as un blackjack avec ${carta1} y ${carta2}! 🎉`);
    }
  
    return res.send(`${user}, tes lettres: ${carta1} ${carta2} (Total: ${total}). 
Utilise !pedir ou !plantar.`);
  });
  
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });

  app.get("/pedir", (req, res) => {
    const user = req.query.user?.toLowerCase();
  
    if (!user) return res.send("Falta el nombre del usuario.");
  
    const partida = partidas[user];
  
    if (!partida) {
      return res.send(`${user}, no tienes una partida activa. Usa !blackjack para empezar.`);
    }
  
    if (partida.terminado) {
      return res.send(`${user}, tu partida ya terminó. Usa !blackjack para iniciar otra.`);
    }
  
    const nuevaCarta = generarCarta();
    partida.cartasJugador.push(nuevaCarta);
    partida.totalJugador = calcularTotal(partida.cartasJugador);
  
    if (partida.totalJugador > 21) {
      partida.terminado = true;
      return res.send(`${user}, recibiste ${nuevaCarta} y ahora tienes ${partida.totalJugador}. Tu es allé trop loin, idiot ! 💥`);
    }
  
    if (partida.totalJugador === 21) {
      partida.terminado = true;
      return res.send(`${user}, recibiste ${nuevaCarta} y ahora tienes 21. ¡Perfecto! 👏 Usa !blackjack para jugar otra.`);
    }
  
    return res.send(`${user}, recibiste ${nuevaCarta}. Total: ${partida.totalJugador}. Usa !pedir o !plantar.`);
  });
  
  function jugarCrupier() {
    const cartas = [];
    let total = 0;
  
    while (total < 17) {
      const carta = generarCarta();
      cartas.push(carta);
      total = calcularTotal(cartas);
    }
  
    return { cartas, total };
  }
  
  app.get("/plantar", (req, res) => {
    const user = req.query.user?.toLowerCase();
  
    if (!user) return res.send("Falta el nombre del usuario.");
  
    const partida = partidas[user];
  
    if (!partida) {
      return res.send(`${user}, no tienes una partida activa. Usa !blackjack para empezar.`);
    }
  
    if (partida.terminado) {
      return res.send(`${user}, tu partida ya terminó. Usa !blackjack para jugar otra.`);
    }
  
    const crupier = jugarCrupier();
    partida.terminado = true;
  
    const jugadorTotal = partida.totalJugador;
    const crupierTotal = crupier.total;
  
    let resultado = "";
  
    if (crupierTotal > 21 || jugadorTotal > crupierTotal) {
      resultado = `¡Ganaste! 🎉`;
    } else if (jugadorTotal < crupierTotal) {
      resultado = `Perdiste 😢`;
    } else {
      resultado = `¡Empate! 🤝`;
    }
  
    return res.send(`${user}, tus cartas: ${partida.cartasJugador.join(" ")} (${jugadorTotal})\n` +
                    `Crupier: ${crupier.cartas.join(" ")} (${crupierTotal})\n` +
                    `${resultado}`);
  });
  