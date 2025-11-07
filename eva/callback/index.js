import express from 'express';
const app = express();
const elsoFuttatando = (req, res, next) => {
  console.log('Első futtatandó middleware');
  next();
};  
const masodikFuttatando = (req, res, next) => {
  console.log('Második futtatandó middleware');
  next();
};  
app.get('/', elsoFuttatando, masodikFuttatando, (req, res) => {
  res.send('két middleware után ez a válasz!');}  );    
app.listen(3000, () => {    
  console.log('EVA Callback Server is running on http://localhost:3000');
});

