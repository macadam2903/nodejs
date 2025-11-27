import express from 'express';
import pool from './db.js';

const router = express.Router();

// CREATE - Új tantárgy hozzáadása
router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body;
    const [result] = await pool.query(
      'INSERT INTO courses (title, description) VALUES (?, ?)',
      [title, description]
    );
    res.status(201).json({ 
      id: result.insertId, 
      title, 
      description 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ - Összes tantárgy lekérdezése
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM courses');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ - Egy tantárgy lekérdezése ID alapján
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM courses WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Tantárgy nem található' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE - Tantárgy frissítése
router.put('/:id', async (req, res) => {
  try {
    const { title, description } = req.body;
    const [result] = await pool.query(
      'UPDATE courses SET title = ?, description = ? WHERE id = ?',
      [title, description, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Tantárgy nem található' });
    }
    res.json({ id: req.params.id, title, description });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Tantárgy törlése
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM courses WHERE id = ?',
      [req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Tantárgy nem található' });
    }
    res.json({ message: 'Tantárgy sikeresen törölve' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;