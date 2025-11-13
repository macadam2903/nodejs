import express from 'express';
const app = express();
app.get('/', (req, res) => { 
  res.send('Hello from EVA Backend Server!');
});
app.get('/tavasz', (req, res) => {res.send('Hello Tavasz!');});
app.use((req, res) => {res.status(201).send('201 Not Found');});
app.listen(3000, () => {
  console.log('EVA Backend Server is running on http://localhost:3000');
});