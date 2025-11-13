import express from 'express'; //megadtuk a forraskod helyet    
const app = express();
//urlben : //http://localhost:3000/?evszak=tavasz&honap=marcius
app.get('/', (req, res) => { //
    let evszak = req.query.evszak; //lekerdezzuk a query parameter erteket
    let honap = req.query.honap;   
    if (evszak === 'tavasz') {
        res.send(`TAVASZ VAN és a honap: ${honap}`);
    } else if (evszak === 'nyar') {
        res.send(`NYAR VAN es a honap: ${honap}`);
    } else if (evszak === 'osz') {
        res.send(`OSZ VAN es a honap: ${honap}`);
    } else if (evszak === 'tel') {  
        res.send(`TEL VAN es a honap: ${honap}`);
    } else {
        res.send('NEM TUDOM, HOGY MI VAN ');
    }
});
app.get('/masik', (req, res) => {  
    res.send('welcome to the masik page');
});
app.use((req, res) => {
  res.status(404).send('404 Not Found');
});
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});