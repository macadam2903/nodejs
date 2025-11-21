import pool from '../db.js';

export const getAllVevok = async () => {
    const [rows] = await pool.execute('SELECT * FROM vevo ORDER BY vazon');
    return rows;
};

export const getVevoById = async (vazon) => {
    const [rows] = await pool.execute('SELECT * FROM vevo WHERE vazon = ?', [vazon]);
    return rows[0];
};

export const insertVevo = async (vevoData) => {
    const { vnev, vcim } = vevoData;
    const sql = 'INSERT INTO vevo (vnev, vcim) VALUES (?, ?)';
    const [result] = await pool.execute(sql, [vnev, vcim]);
    return result;
};

export const updateVevo = async (vazon, vevoData) => {
    const { vnev, vcim } = vevoData;
    const sql = 'UPDATE vevo SET vnev = ?, vcim = ? WHERE vazon = ?';
    const [result] = await pool.execute(sql, [vnev, vcim, vazon]);
    return result;
};

export const deleteVevo = async (vazon) => {
    const [result] = await pool.execute('DELETE FROM vevo WHERE vazon = ?', [vazon]);
    return result;
};