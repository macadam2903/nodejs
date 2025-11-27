import express from 'express';
import pool from './db.js';

const router = express.Router();

// CREATE - Új beiratkozás
router.post('/', async (req, res) => {
  try {
    const { student_id, course_id } = req.body;
    const [result] = await pool.query(
      'INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)',
      [student_id, course_id]
    );
    res.status(201).json({ 
      id: result.insertId, 
      student_id, 
      course_id 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ - Összes beiratkozás lekérdezése (JOIN-nal)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        e.id, 
        e.student_id, 
        e.course_id, 
        e.enrolled_at,
        s.name as student_name,
        c.title as course_title
      FROM enrollments e
      JOIN students s ON e.student_id = s.id
      JOIN courses c ON e.course_id = c.id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ - Egy diák összes tantárgya
router.get('/student/:student_id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        e.id, 
        e.enrolled_at,
        c.id as course_id,
        c.title,
        c.description
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE e.student_id = ?
    `, [req.params.student_id]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ - Egy tantárgy összes diákja
router.get('/course/:course_id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        e.id, 
        e.enrolled_at,
        s.id as student_id,
        s.name,
        s.email
      FROM enrollments e
      JOIN students s ON e.student_id = s.id
      WHERE e.course_id = ?
    `, [req.params.course_id]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Beiratkozás törlése
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM enrollments WHERE id = ?',
      [req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Beiratkozás nem található' });
    }
    res.json({ message: 'Beiratkozás sikeresen törölve' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
