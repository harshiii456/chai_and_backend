require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/twitter', (req, res) => {
  res.send('Harshita is cool');
});

app.get('/login', (req, res) => {
  res.send('<h1>please login here</h1>');
});

app.get('/youtube', (req, res) => {
  res.send('chai and code is the best channel');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
