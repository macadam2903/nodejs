import express from 'express';
const order_itemsRouter = express.Router();

// GET /order-items - Az összes rendelési tétel lekérése
order_itemsRouter.get('/:rendelesId', (req, res) => {
    const rendelesId = req.params.rendelesId;
    // Itt általában adatbázisból kérnénk le az adatokat
});
 export default order_itemsRouter;