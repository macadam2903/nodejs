import express from 'express';
const app = express();
app.get('/', (req, res) => { 
  res.send('Hello from EVA Backend Server!');
});
app.listen(3000, () => {
  console.log('EVA Backend Server is running on http://localhost:3000');
});