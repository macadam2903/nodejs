import express from 'express';
const customersRouter = express.Router();
 
customersRouter.get('/', async (req, res) => {
    try {
        const customers = await customerModel.getAllCustomers();
        res.status(200).send(customers);
    } catch (error) {
        console.error('Hiba az ügyfelek lekérésekor:', error);
        res.status(500).send({ error: 'Hiba történt az ügyfelek lekérése során.' });
    }
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
