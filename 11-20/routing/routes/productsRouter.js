import express from 'express';
const productsRouter = express.Router();

productsRouter.get('/', (req, res) => {
    // a teljes útvonal: http://localhost:3000/products/
    res.send('Összes termék lekérése');
});

productsRouter.get('/:id', (req, res) => {
    const productId = req.params.id;
    res.send(`Termék lekérése ID alapján: ${productId}`);
});

export default productsRouter;