import express from 'express';
const categoriesRouter = express.Router();

categoriesRouter.get('/', (req, res) => {
    res.send('Összes kategória lekérése');
});

export default categoriesRouter;