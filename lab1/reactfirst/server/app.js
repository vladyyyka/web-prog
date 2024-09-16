const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../build')));

app.post('/add', (req, res) => {
  const { first, second } = req.body;
  const result = parseFloat(first) + parseFloat(second);
  res.json({ result });
});

app.post('/subtract', (req, res) => {
  const { first, second } = req.body;
  const result = parseFloat(first) - parseFloat(second);
  res.json({ result });
});

app.post('/multiply', (req, res) => {
  const { first, second } = req.body;
  const result = parseFloat(first) * parseFloat(second);
  res.json({ result });
});

app.post('/divide', (req, res) => {
  const { first, second } = req.body;
  if (parseFloat(second) === 0) {
    return res.json({ error: 'На ноль делить нельзя' });
  }
  const result = parseFloat(first) / parseFloat(second);
  res.json({ result });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Сервер на открылся на порту ${PORT}`);
});
