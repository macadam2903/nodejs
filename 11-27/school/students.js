import express from 'express';
import pool from './db.js';

const router = express.Router();

// CREATE - Új diák hozzáadása
router.post('/', async (req, res) => {
  try {
    const { name, email, birthdate } = req.body;
    const [result] = await pool.query(
      'INSERT INTO students (name, email, birthdate) VALUES (?, ?, ?)',
      [name, email, birthdate]
    );
    res.status(201).json({ 
      id: result.insertId, 
      name, 
      email, 
      birthdate 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ - Összes diák lekérdezése
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM students');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ - Egy diák lekérdezése ID alapján
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM students WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Diák nem található' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE - Diák adatainak frissítése
router.put('/:id', async (req, res) => {
  try {
    const { name, email, birthdate } = req.body;
    const [result] = await pool.query(
      'UPDATE students SET name = ?, email = ?, birthdate = ? WHERE id = ?',
      [name, email, birthdate, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Diák nem található' });
    }
    res.json({ id: req.params.id, name, email, birthdate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Diák törlése
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM students WHERE id = ?',
      [req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Diák nem található' });
    }
    res.json({ message: 'Diák sikeresen törölve' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;