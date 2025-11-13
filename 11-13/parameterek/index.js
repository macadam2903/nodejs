import express from 'express';
const app = express();
app.get('/:evszak/', (req, res) => {
    const evszak = req.params.evszak;
    const honap = req.query.honap;
    res .send(`Az evszak amit megadtal: ${evszak} és a honap: ${honap}`);
}   );
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
