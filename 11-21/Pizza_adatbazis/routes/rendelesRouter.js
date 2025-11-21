import express from 'express';
import * as rendelesModel from '../models/rendelesModel.js';

const router = express.Router();

// GET /rendeles
router.get('/', async (req, res) => {
    try {
        const rendelesek = await rendelesModel.getAllRendelesek();
        res.status(200).send(rendelesek);
    } catch (error) {
        console.error('Hiba a rendelések lekérésekor:', error);
        res.status(500).send({ error: 'Hiba történt a rendelések lekérése során.' });
    }
});

// GET /rendeles/:razon
router.get('/:razon', async (req, res) => {
    try {
        const { razon } = req.params;
        
        if (!razon || isNaN(razon)) {
            return res.status(400).send({ error: 'Érvénytelen rendelés azonosító.' });
        }

        const rendeles = await rendelesModel.getRendelesById(razon);
        
        if (!rendeles) {
            return res.status(404).send({ error: 'A rendelés nem található.' });
        }
        
        res.status(200).send(rendeles);
    } catch (error) {
        console.error('Hiba a rendelés lekérésekor:', error);
        res.status(500).send({ error: 'Hiba történt a rendelés lekérése során.' });
    }
});

// POST /rendeles
router.post('/', async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).send({ error: 'Hiányzó adatok.' });
        }

        const { vazon, fazon, idopont } = req.body;
        
        if (!vazon || !fazon || !idopont) {
            return res.status(400).send({
                error: 'Vevő azonosító, futár azonosító és időpont megadása kötelező.'
            });
        }

        if (isNaN(vazon) || isNaN(fazon)) {
            return res.status(400).send({
                error: 'A vevő és futár azonosítónak számnak kell lennie.'
            });
        }

        const result = await rendelesModel.insertRendeles(req.body);
        res.status(201).send({
            message: 'Rendelés sikeresen létrehozva.',
            id: result.insertId
        });
    } catch (error) {
        console.error('Hiba a rendelés létrehozásakor:', error);
        
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(404).send({
                error: 'A megadott vevő vagy futár nem található.'
            });
        }
        
        res.status(500).send({
            error: 'Hiba történt a rendelés létrehozása során.'
        });
    }
});

// DELETE /rendeles/:razon
router.delete('/:razon', async (req, res) => {
    try {
        const { razon } = req.params;
        
        if (!razon || isNaN(razon)) {
            return res.status(400).send({ error: 'Érvénytelen rendelés azonosító.' });
        }

        const result = await rendelesModel.deleteRendeles(razon);
        
        if (result.affectedRows === 0) {
            return res.status(404).send({ error: 'A rendelés nem található.' });
        }

        res.status(200).send({
            message: 'Rendelés sikeresen törölve.'
        });
    } catch (error) {
        console.error('Hiba a rendelés törlésekor:', error);
        res.status(500).send({
            error: 'Hiba történt a rendelés törlése során.'
        });
    }
});

export default router;