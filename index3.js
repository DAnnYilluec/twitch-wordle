const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

const DATA_FILE = './users.json';
const ADMIN = 'DAnnYilluec'; // Cambia esto por tu nombre de usuario en Twitch

function getUsers() {
  if (!fs.existsSync(DATA_FILE)) return {};
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

function saveUsers(users) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
}

function inicializarUsuario(user) {
  const users = getUsers();
  if (!users[user]) {
    users[user] = { monedas: 10 };
    saveUsers(users);
  }
}

function jugarTragaperras(user) {
  let users = getUsers();

  if (!users[user]) {
    users[user] = { monedas: 50 };
  }

  if (users[user].monedas <= 0) {
    return `@${user}, no tienes monedas suficientes. Usa !monedas para ver tu saldo.`;
  }

  users[user].monedas--;

  const simbolos = ['🍒', '🍋', '🍇', '7'];
  const tirada = [
    simbolos[Math.floor(Math.random() * simbolos.length)],
    simbolos[Math.floor(Math.random() * simbolos.length)],
    simbolos[Math.floor(Math.random() * simbolos.length)]
  ];

  let mensaje = `${tirada.join(' ')}`;

  if (tirada[0] === tirada[1] && tirada[1] === tirada[2]) {
    users[user].monedas += 10;
    mensaje += ` +10 monedas. Ahora tienes ${users[user].monedas} monedas.`;
  } else if (tirada[0] === tirada[1] || tirada[1] === tirada[2] || tirada[0] === tirada[2]) {
    users[user].monedas += 3;
    mensaje += ` +3 monedas. Ahora tienes ${users[user].monedas} monedas.`;
  } else {
    mensaje += `Te quedan ${users[user].monedas} monedas.`;
  }

  saveUsers(users);
  return mensaje;
}

function verMonedas(user) {
  let users = getUsers();
  if (!users[user]) {
    users[user] = { monedas: 50 };
    saveUsers(users);
  }
  return `@${user} tienes ${users[user].monedas} monedas.`;
}

function darMonedas(admin, usuario, cantidad) {
  if (admin.toLowerCase() !== ADMIN.toLowerCase()) {
    return `@${admin}, no tienes permiso para dar monedas.`;
  }

  if (!usuario || isNaN(cantidad) || cantidad <= 0) {
    return `Parámetros inválidos. Usa: /dar?admin=${ADMIN}&usuario=nombre&cantidad=10`;
  }

  let users = getUsers();
  if (!users[usuario]) {
    users[usuario] = { monedas: 50 };
  }

  users[usuario].monedas += parseInt(cantidad);
  saveUsers(users);
  return `@${usuario} ha recibido ${cantidad} monedas de @${admin}. Total: ${users[usuario].monedas} monedas.`;
}

// Endpoint para jugar
app.get('/tragaperras', (req, res) => {
  const user = (req.query.user || '').toLowerCase();
  if (!user) return res.send('Usuario no especificado.');
  res.send(jugarTragaperras(user));
});

// Endpoint para ver monedas
app.get('/monedas', (req, res) => {
  const user = (req.query.user || '').toLowerCase();
  if (!user) return res.send('Usuario no especificado.');
  res.send(verMonedas(user));
});

// Endpoint para dar monedas (solo admin)
app.get('/dar', (req, res) => {
  const admin = (req.query.admin || '').toLowerCase();
  const usuario = (req.query.usuario || '').toLowerCase();
  const cantidad = parseInt(req.query.cantidad);
  res.send(darMonedas(admin, usuario, cantidad));
});

app.listen(port, () => {
  console.log(`Servidor escuchando en puerto ${port}`);
});
