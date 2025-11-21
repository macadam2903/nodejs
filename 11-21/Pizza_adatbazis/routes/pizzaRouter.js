import express from 'express';
import * as pizzaModel from '../models/pizzaModel.js';

const router = express.Router();

// GET /pizza
router.get('/', async (req, res) => {
    try {
        const pizzak = await pizzaModel.getAllPizzak();
        res.status(200).send(pizzak);
    } catch (error) {
        console.error('Hiba a pizzák lekérésekor:', error);
        res.status(500).send({ error: 'Hiba történt a pizzák lekérése során.' });
    }
});

// GET /pizza/:pazon
router.get('/:pazon', async (req, res) => {
    try {
        const { pazon } = req.params;
        
        if (!pazon || isNaN(pazon)) {
            return res.status(400).send({ error: 'Érvénytelen pizza azonosító.' });
        }

        const pizza = await pizzaModel.getPizzaById(pazon);
        
        if (!pizza) {
            return res.status(404).send({ error: 'A pizza nem található.' });
        }
        
        res.status(200).send(pizza);
    } catch (error) {
        console.error('Hiba a pizza lekérésekor:', error);
        res.status(500).send({ error: 'Hiba történt a pizza lekérése során.' });
    }
});

// POST /pizza
router.post('/', async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).send({ error: 'Hiányzó adatok.' });
        }

        const { pnev, par } = req.body;
        
        if (!pnev || !par) {
            return res.status(400).send({
                error: 'Pizza neve és ára megadása kötelező.'
            });
        }

        if (isNaN(par) || par <= 0) {
            return res.status(400).send({
                error: 'A pizza árának pozitív számnak kell lennie.'
            });
        }

        const result = await pizzaModel.insertPizza(req.body);
        res.status(201).send({
            message: 'Pizza sikeresen hozzáadva.',
            id: result.insertId
        });
    } catch (error) {
        console.error('Hiba a pizza hozzáadásakor:', error);
        res.status(500).send({
            error: 'Hiba történt a pizza hozzáadása során.'
        });
    }
});

// PUT /pizza/:pazon
router.put('/:pazon', async (req, res) => {
    try {
        const { pazon } = req.params;
        
        if (!pazon || isNaN(pazon)) {
            return res.status(400).send({ error: 'Érvénytelen pizza azonosító.' });
        }

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).send({ error: 'Hiányzó adatok.' });
        }

        const { pnev, par } = req.body;
        
        if (!pnev || !par) {
            return res.status(400).send({
                error: 'Pizza neve és ára megadása kötelező.'
            });
        }

        if (isNaN(par) || par <= 0) {
            return res.status(400).send({
                error: 'A pizza árának pozitív számnak kell lennie.'
            });
        }

        const result = await pizzaModel.updatePizza(pazon, req.body);
        
        if (result.affectedRows === 0) {
            return res.status(404).send({ error: 'A pizza nem található.' });
        }

        res.status(200).send({
            message: 'Pizza adatai sikeresen frissítve.'
        });
    } catch (error) {
        console.error('Hiba a pizza frissítésekor:', error);
        res.status(500).send({
            error: 'Hiba történt a pizza frissítése során.'
        });
    }
});

// DELETE /pizza/:pazon
router.delete('/:pazon', async (req, res) => {
    try {
        const { pazon } = req.params;
        
        if (!pazon || isNaN(pazon)) {
            return res.status(400).send({ error: 'Érvénytelen pizza azonosító.' });
        }

        const result = await pizzaModel.deletePizza(pazon);
        
        if (result.affectedRows === 0) {
            return res.status(404).send({ error: 'A pizza nem található.' });
        }

        res.status(200).send({
            message: 'Pizza sikeresen törölve.'
        });
    } catch (error) {
        console.error('Hiba a pizza törlésekor:', error);
        
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).send({
                error: 'A pizza nem törölhető, mert rendelési tételekben szerepel.'
            });
        }
        
        res.status(500).send({
            error: 'Hiba történt a pizza törlése során.'
        });
    }
});

export default router;