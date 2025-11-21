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


app.use('/api/futar', futarRouter); 
app.use('/api/pizza', pizzaRouter);
app.use('/api/rendeles', rendelesRouter);
app.use('/api/tetel', tetelRouter);
app.use('/api/vevo', vevoRouter);

app.listen(3000, () => {
    console.log('Szerver elindult a http://localhost:3000 címen');
});