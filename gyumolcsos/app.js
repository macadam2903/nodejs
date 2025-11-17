const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// CORS engedélyezése (hogy a böngésző ne blokkolja)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Statikus fájlok kiszolgálása
app.use(express.static('public'));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// MySQL kapcsolat konfiguráció
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '', // Módosítsd a saját jelszavadra
  database: 'fruits'
};

// Adatbázis kapcsolat létrehozása
let pool;

async function initDatabase() {
  try {
    pool = mysql.createPool(dbConfig);
    console.log('Sikeres csatlakozás a MySQL adatbázishoz');
  } catch (error) {
    console.error('Adatbázis kapcsolódási hiba:', error);
    process.exit(1);
  }
}

// Validációs függvény
function validateFruit(data, isUpdate = false) {
  const errors = [];

  if (!isUpdate || data.name !== undefined) {
    if (!data.name || data.name.trim() === '') {
      errors.push('A gyümölcs neve kötelező');
    } else if (data.name.length > 100) {
      errors.push('A gyümölcs neve maximum 100 karakter lehet');
    }
  }

  if (!isUpdate || data.color !== undefined) {
    if (!data.color || data.color.trim() === '') {
      errors.push('A gyümölcs színe kötelező');
    } else if (data.color.length > 50) {
      errors.push('A gyümölcs színe maximum 50 karakter lehet');
    }
  }

  if (!isUpdate || data.price !== undefined) {
    if (data.price === undefined || data.price === null) {
      errors.push('A gyümölcs ára kötelező');
    } else if (isNaN(data.price) || parseFloat(data.price) < 0) {
      errors.push('A gyümölcs ára nem lehet negatív szám');
    } else if (parseFloat(data.price) > 99999.99) {
      errors.push('A gyümölcs ára maximum 99999.99 lehet');
    }
  }

  return errors;
}

// CRUD végpontok

// GET / - API információ
app.get('/', (req, res) => {
  res.json({
    message: 'Gyümölcs API',
    version: '1.0.0',
    endpoints: {
      'GET /fruits': 'Összes gyümölcs listázása',
      'GET /fruits/:id': 'Egy gyümölcs lekérdezése',
      'POST /fruits': 'Új gyümölcs hozzáadása',
      'PUT /fruits/:id': 'Gyümölcs módosítása',
      'DELETE /fruits/:id': 'Gyümölcs törlése'
    }
  });
});

// GET /fruits - Összes gyümölcs listázása
app.get('/fruits', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM fruits');
    res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Hiba a gyümölcsök lekérdezésekor:', error);
    res.status(500).json({
      success: false,
      message: 'Szerver hiba történt'
    });
  }
});

// GET /fruits/:id - Egy konkrét gyümölcs lekérdezése
app.get('/fruits/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Érvénytelen ID formátum'
      });
    }

    const [rows] = await pool.query('SELECT * FROM fruits WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'A gyümölcs nem található'
      });
    }

    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Hiba a gyümölcs lekérdezésekor:', error);
    res.status(500).json({
      success: false,
      message: 'Szerver hiba történt'
    });
  }
});

// POST /fruits - Új gyümölcs hozzáadása
app.post('/fruits', async (req, res) => {
  try {
    const { name, color, price } = req.body;
    
    // Validáció
    const errors = validateFruit({ name, color, price });
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validációs hibák',
        errors: errors
      });
    }

    const [result] = await pool.query(
      'INSERT INTO fruits (name, color, price) VALUES (?, ?, ?)',
      [name.trim(), color.trim(), parseFloat(price)]
    );

    res.status(201).json({
      success: true,
      message: 'Gyümölcs sikeresen hozzáadva',
      data: {
        id: result.insertId,
        name: name.trim(),
        color: color.trim(),
        price: parseFloat(price)
      }
    });
  } catch (error) {
    console.error('Hiba a gyümölcs hozzáadásakor:', error);
    res.status(500).json({
      success: false,
      message: 'Szerver hiba történt'
    });
  }
});

// PUT /fruits/:id - Gyümölcs módosítása
app.put('/fruits/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color, price } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Érvénytelen ID formátum'
      });
    }

    // Ellenőrizzük, hogy létezik-e a gyümölcs
    const [existingFruit] = await pool.query('SELECT * FROM fruits WHERE id = ?', [id]);
    
    if (existingFruit.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'A gyümölcs nem található'
      });
    }

    // Validáció
    const errors = validateFruit({ name, color, price }, true);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validációs hibák',
        errors: errors
      });
    }

    // Frissítendő mezők összeállítása
    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name.trim());
    }
    if (color !== undefined) {
      updates.push('color = ?');
      values.push(color.trim());
    }
    if (price !== undefined) {
      updates.push('price = ?');
      values.push(parseFloat(price));
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Nincs frissítendő adat'
      });
    }

    values.push(id);
    await pool.query(
      `UPDATE fruits SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    // Lekérjük a frissített adatokat
    const [updatedFruit] = await pool.query('SELECT * FROM fruits WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Gyümölcs sikeresen frissítve',
      data: updatedFruit[0]
    });
  } catch (error) {
    console.error('Hiba a gyümölcs frissítésekor:', error);
    res.status(500).json({
      success: false,
      message: 'Szerver hiba történt'
    });
  }
});

// DELETE /fruits/:id - Gyümölcs törlése
app.delete('/fruits/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Érvénytelen ID formátum'
      });
    }

    // Ellenőrizzük, hogy létezik-e a gyümölcs
    const [existingFruit] = await pool.query('SELECT * FROM fruits WHERE id = ?', [id]);
    
    if (existingFruit.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'A gyümölcs nem található'
      });
    }

    await pool.query('DELETE FROM fruits WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Gyümölcs sikeresen törölve',
      data: existingFruit[0]
    });
  } catch (error) {
    console.error('Hiba a gyümölcs törlésekor:', error);
    res.status(500).json({
      success: false,
      message: 'Szerver hiba történt'
    });
  }
});

// 404 kezelése
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'A kért útvonal nem található'
  });
});

// Szerver indítása
async function startServer() {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`Szerver fut a http://localhost:${PORT} címen`);
  });
}

startServer();