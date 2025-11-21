import express from 'express';
import * as futarModel from '../models/futarModel.js';

const router = express.Router();

// GET /futar
router.get('/', async (req, res) => {
    try {
        const futarok = await futarModel.getAllFutarok();
        res.status(200).send(futarok);
    } catch (error) {
        console.error('Hiba a futárok lekérésekor:', error);
        res.status(500).send({ error: 'Hiba történt a futárok lekérése során.' });
    }
});

// GET /futar/:fazon
router.get('/:fazon', async (req, res) => {
    try {
        const { fazon } = req.params;
        
        if (!fazon || isNaN(fazon)) {
            return res.status(400).send({ error: 'Érvénytelen futár azonosító.' });
        }

        const futar = await futarModel.getFutarById(fazon);
        
        if (!futar) {
            return res.status(404).send({ error: 'A futár nem található.' });
        }
        
        res.status(200).send(futar);
    } catch (error) {
        console.error('Hiba a futár lekérésekor:', error);
        res.status(500).send({ error: 'Hiba történt a futár lekérése során.' });
    }
});

// POST /futar
router.post('/', async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).send({ error: 'Hiányzó adatok.' });
        }

        const { fnev, ftel } = req.body;
        
        if (!fnev || !ftel) {
            return res.status(400).send({
                error: 'Futár neve és telefonszáma megadása kötelező.'
            });
        }

        const result = await futarModel.insertFutar(req.body);
        res.status(201).send({
            message: 'Futár sikeresen hozzáadva.',
            id: result.insertId
        });
    } catch (error) {
        console.error('Hiba a futár hozzáadásakor:', error);
        res.status(500).send({
            error: 'Hiba történt a futár hozzáadása során.'
        });
    }
});

// PUT /futar/:fazon
router.put('/:fazon', async (req, res) => {
    try {
        const { fazon } = req.params;
        
        if (!fazon || isNaN(fazon)) {
            return res.status(400).send({ error: 'Érvénytelen futár azonosító.' });
        }

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).send({ error: 'Hiányzó adatok.' });
        }

        const { fnev, ftel } = req.body;
        
        if (!fnev || !ftel) {
            return res.status(400).send({
                error: 'Futár neve és telefonszáma megadása kötelező.'
            });
        }

        const result = await futarModel.updateFutar(fazon, req.body);
        
        if (result.affectedRows === 0) {
            return res.status(404).send({ error: 'A futár nem található.' });
        }

        res.status(200).send({
            message: 'Futár adatai sikeresen frissítve.'
        });
    } catch (error) {
        console.error('Hiba a futár frissítésekor:', error);
        res.status(500).send({
            error: 'Hiba történt a futár frissítése során.'
        });
    }
});

// DELETE /futar/:fazon
router.delete('/:fazon', async (req, res) => {
    try {
        const { fazon } = req.params;
        
        if (!fazon || isNaN(fazon)) {
            return res.status(400).send({ error: 'Érvénytelen futár azonosító.' });
        }

        const result = await futarModel.deleteFutar(fazon);
        
        if (result.affectedRows === 0) {
            return res.status(404).send({ error: 'A futár nem található.' });
        }

        res.status(200).send({
            message: 'Futár sikeresen törölve.'
        });
    } catch (error) {
        console.error('Hiba a futár törlésekor:', error);
        
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).send({
                error: 'A futár nem törölhető, mert aktív rendelései vannak.'
            });
        }
        
        res.status(500).send({
            error: 'Hiba történt a futár törlése során.'
        });
    }
});

export default router;