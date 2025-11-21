import express from 'express';
const app = express();

import cors from 'cors';
app.use(cors()); // Kikapcsolja a CORS korlátozásokat

app.use(express.json()); // Bejövő JSON kérések feldolgozása
import futarRouter from './routes/futarRouter.js';
import pizzaRouter from './routes/pizzaRouter.js';
import rendelesRouter from './routes/rendelesRouter.js';
import tetelRouter from './routes/tetelRouter.js';
import vevoRouter from './routes/vevoRouter.js';


app.use('/futar', futarRouter); 
app.use('/pizza', pizzaRouter);
app.use('/rendeles', rendelesRouter);
app.use('/tetel', tetelRouter);
app.use('/vevo', vevoRouter);

app.listen(3000, () => {
    console.log('Szerver elindult a http://localhost:3000 címen');
});