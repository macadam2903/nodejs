import pool from '../db.js';

export const getAllPizzak = async () => {
    const [rows] = await pool.execute('SELECT * FROM pizza ORDER BY pazon');
    return rows;
};

export const getPizzaById = async (pazon) => {
    const [rows] = await pool.execute('SELECT * FROM pizza WHERE pazon = ?', [pazon]);
    return rows[0];
};

export const insertPizza = async (pizzaData) => {
    const { pnev, par } = pizzaData;
    const sql = 'INSERT INTO pizza (pnev, par) VALUES (?, ?)';
    const [result] = await pool.execute(sql, [pnev, par]);
    return result;
};

export const updatePizza = async (pazon, pizzaData) => {
    const { pnev, par } = pizzaData;
    const sql = 'UPDATE pizza SET pnev = ?, par = ? WHERE pazon = ?';
    const [result] = await pool.execute(sql, [pnev, par, pazon]);
    return result;
};

export const deletePizza = async (pazon) => {
    const [result] = await pool.execute('DELETE FROM pizza WHERE pazon = ?', [pazon]);
    return result;
};