import pool from '../db.js';

export const getAllFutarok = async () => {
    const [rows] = await pool.execute('SELECT * FROM futar ORDER BY fazon');
    return rows;
};

export const getFutarById = async (fazon) => {
    const [rows] = await pool.execute('SELECT * FROM futar WHERE fazon = ?', [fazon]);
    return rows[0];
};

export const insertFutar = async (futarData) => {
    const { fnev, ftel } = futarData;
    const sql = 'INSERT INTO futar (fnev, ftel) VALUES (?, ?)';
    const [result] = await pool.execute(sql, [fnev, ftel]);
    return result;
};

export const updateFutar = async (fazon, futarData) => {
    const { fnev, ftel } = futarData;
    const sql = 'UPDATE futar SET fnev = ?, ftel = ? WHERE fazon = ?';
    const [result] = await pool.execute(sql, [fnev, ftel, fazon]);
    return result;
};

export const deleteFutar = async (fazon) => {
    const [result] = await pool.execute('DELETE FROM futar WHERE fazon = ?', [fazon]);
    return result;
};