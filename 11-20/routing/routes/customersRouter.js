import express from 'express';
const customersRouter = express.Router();
customersRouter.get('/', (req, res) => {
    // a teljes útvonal: http://localhost:3000/customers/
    res.send('Összes ügyfél lekérése');
});
customersRouter.get('/:id', (req, res) => {
    const customerId = req.params.id;
    res.send(`Ügyfél lekérése ID alapján: ${customerId}`);
});
customersRouter.post('/', (req, res) => {
    res.send('Új ügyfél létrehozása');
});
customersRouter.put('/:id', (req, res) => {
    const customerId = req.params.id;
    res.send(`Ügyfél frissítése ID alapján: ${customerId}`);
});


export default customersRouter;
