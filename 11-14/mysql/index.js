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

app.get('/users/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const [rows] = await pool.execute('SELECT * FROM `users` WHERE `userid` = ?', [userId]);
        if (rows.length === 0) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.json(rows[0]);
        }
    } catch (err) {
        console.error(err); 
        res.status(500).json({ error: 'Database query error' });
    }
});

app.post('/users', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const [result] = await pool.execute(
            'INSERT INTO `users` (`userid`,`username`, `email`, `password`) VALUES (?, ?, ?)', 
            [username, email, password]);
        res.status(201).json({ userid: result.insertId, username, email });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database insert error' });
    }
}
);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
