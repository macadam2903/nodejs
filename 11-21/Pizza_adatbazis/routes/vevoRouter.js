import express from 'express';
import * as vevoModel from '../models/vevoModel.js';

const router = express.Router();

// GET /vevo
router.get('/', async (req, res) => {
    try {
        const vevok = await vevoModel.getAllVevok();
        res.status(200).send(vevok);
    } catch (error) {
        console.error('Hiba a vevők lekérésekor:', error);
        res.status(500).send({ error: 'Hiba történt a vevők lekérése során.' });
    }
});

// GET /vevo/:vazon
router.get('/:vazon', async (req, res) => {
    try {
        const { vazon } = req.params;
        
        if (!vazon || isNaN(vazon)) {
            return res.status(400).send({ error: 'Érvénytelen vevő azonosító.' });
        }

        const vevo = await vevoModel.getVevoById(vazon);
        
        if (!vevo) {
            return res.status(404).send({ error: 'A vevő nem található.' });
        }
        
        res.status(200).send(vevo);
    } catch (error) {
        console.error('Hiba a vevő lekérésekor:', error);
        res.status(500).send({ error: 'Hiba történt a vevő lekérése során.' });
    }
});

// POST /vevo
router.post('/', async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).send({ error: 'Hiányzó adatok.' });
        }

        const { vnev, vcim } = req.body;
        
        if (!vnev || !vcim) {
            return res.status(400).send({
                error: 'Vevő neve és címe megadása kötelező.'
            });
        }

        const result = await vevoModel.insertVevo(req.body);
        res.status(201).send({
            message: 'Vevő sikeresen hozzáadva.',
            id: result.insertId
        });
    } catch (error) {
        console.error('Hiba a vevő hozzáadásakor:', error);
        res.status(500).send({
            error: 'Hiba történt a vevő hozzáadása során.'
        });
    }
});

// PUT /vevo/:vazon
router.put('/:vazon', async (req, res) => {
    try {
        const { vazon } = req.params;
        
        if (!vazon || isNaN(vazon)) {
            return res.status(400).send({ error: 'Érvénytelen vevő azonosító.' });
        }

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).send({ error: 'Hiányzó adatok.' });
        }

        const { vnev, vcim } = req.body;
        
        if (!vnev || !vcim) {
            return res.status(400).send({
                error: 'Vevő neve és címe megadása kötelező.'
            });
        }

        const result = await vevoModel.updateVevo(vazon, req.body);
        
        if (result.affectedRows === 0) {
            return res.status(404).send({ error: 'A vevő nem található.' });
        }

        res.status(200).send({
            message: 'Vevő adatai sikeresen frissítve.'
        });
    } catch (error) {
        console.error('Hiba a vevő frissítésekor:', error);
        res.status(500).send({
            error: 'Hiba történt a vevő frissítése során.'
        });
    }
});

// DELETE /vevo/:vazon
router.delete('/:vazon', async (req, res) => {
    try {
        const { vazon } = req.params;
        
        if (!vazon || isNaN(vazon)) {
            return res.status(400).send({ error: 'Érvénytelen vevő azonosító.' });
        }

        const result = await vevoModel.deleteVevo(vazon);
        
        if (result.affectedRows === 0) {
            return res.status(404).send({ error: 'A vevő nem található.' });
        }

        res.status(200).send({
            message: 'Vevő sikeresen törölve.'
        });
    } catch (error) {
        console.error('Hiba a vevő törlésekor:', error);
        
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).send({
                error: 'A vevő nem törölhető, mert aktív rendelései vannak.'
            });
        }
        
        res.status(500).send({
            error: 'Hiba történt a vevő törlése során.'
        });
    }
});

export default router;