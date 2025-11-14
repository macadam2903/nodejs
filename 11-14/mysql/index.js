import express from 'express';
import pool from './db.js';
import 'dotenv/config';

const app = express();
const PORT = process.env.SERVERPORT || 3000;
app.use(express.json({ extended: true }));
app.get('/users', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Database query error' });
    }
});
