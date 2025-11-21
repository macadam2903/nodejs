import express from 'express';
import * as customerModel from '../model/customersModel.js';
const customersRouter = express.Router();
 
customersRouter.get('/', async (req, res) => {
    try {
        const customers = await customerModel.getAllCustomers();
        res.status(200).send(customers);
    } catch (error) {
        console.error('Hiba az ügyfelek lekérésekor:', error);
        res.status(500).send({ error: 'Hiba történt az ügyfelek lekérése során.' });
    }
});
 
customersRouter.post('/', async (req, res) => {
    try {
        // Ellenőrizd, hogy van-e body
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).send({ error: 'Hiányzó adatok.' });
        }
 
        const { Nev, Email, Cim, Telefon, Jelszo_String } = req.body;
       
        // Kötelező mezők ellenőrzése
        if (!Nev || !Email || !Jelszo_String) {
            return res.status(400).send({
                error: 'Név, email és jelszó megadása kötelező.'
            });
        }
 
        const result = await customerModel.insertCustomer(req.body);
        res.status(201).send({
            message: 'Ügyfél sikeresen hozzáadva.',
            id: result.insertId
        });
    } catch (error) {
        console.error('Hiba az ügyfél hozzáadásakor:', error);
       
        // Duplikált email hiba kezelése
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).send({
                error: 'Ez az email cím már regisztrálva van.'
            });
        }
       
        res.status(500).send({
            error: 'Hiba történt az ügyfél hozzáadása során.'
        });
    }
});
 
export default customersRouter;