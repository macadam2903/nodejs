import express from 'express';
import * as ordersModel from '../model/ordersModel.js';

const ordersRouter = express.Router();

ordersRouter.get('/', async (req, res) => {
    // a teljes útvonal: /orders/
    try {
        const orders = await ordersModel.getAllOrders();
        res.status(200).send(orders);
    } catch (error) {
        res.status(500).send({ error: 'Hiba történt a rendelések lekérése során.' });
    }
});

ordersRouter.get('/:id', (req, res) => {
    const orderId = req.params.id;
    res.send(`Rendelés lekérése ID alapján: ${orderId}`);
});

ordersRouter.post('/', (req, res) => {
    res.send('Új rendelés létrehozása');
});

ordersRouter.put('/:id', (req, res) => {
    const orderId = req.params.id;
    res.send(`Rendelés frissítése ID alapján: ${orderId}`);
});
export default ordersRouter;