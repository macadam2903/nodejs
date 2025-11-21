import express from 'express';
const app = express();

import cors from 'cors';
app.use(cors()); // Kikapcsolja a CORS korlátozásokat

app.use(express.json()); // Bejövő JSON kérések feldolgozása
import ordersRouter from './routes/ordersRouter.js';
import productsRouter from './routes/productsRouter.js';
import customersRouter from './routes/customersRouter.js';
import categoriesRouter from './routes/categoriesRouter.js';
import order_itemsRouter from './routes/order_itemsRouter.js';


app.use('/orders', ordersRouter); //becsatolja az ordersRouter-t az /orders útvonalra
app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);
app.use('/customers', customersRouter);
app.use('/order-items', order_itemsRouter);

app.listen(3000, () => {
    console.log('Szerver elindult a http://localhost:3000 címen');
});