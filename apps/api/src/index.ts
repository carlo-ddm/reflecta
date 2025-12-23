// index.js (TEST)
import express from 'express';
const app = express();
const port = '3000';

app.get('/', (req, res) => {
  res.send('Hello World!');
  console.log('Risposta inviata');
});

app.listen(port, () => {
  console.log(`Esempio di app in ascolto sulla porta ${port} `);
});
