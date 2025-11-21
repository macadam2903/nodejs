import pool from "../db.js";

export const getAllTetelek = async () => {
    const sql = `
        SELECT 
            t.razon,
            t.pazon,
            p.pnev,
            p.par,
            t.db,
            (t.db * p.par) AS osszeg
        FROM tetel t
        INNER JOIN pizza p ON t.pazon = p.pazon
        ORDER BY t.razon, t.pazon
    `;
    const [rows] = await pool.execute(sql);
    return rows;
};
export const getTetelById = async (razon, pazon) => {
    const sql = `
        SELECT 
            t.razon,
            t.pazon,
            p.pnev,
            p.par,
            t.db,
            (t.db * p.par) AS osszeg
        FROM tetel t
        INNER JOIN pizza p ON t.pazon = p.pazon
        WHERE t.razon = ? AND t.pazon = ?
    `;
    const [rows] = await pool.execute(sql, [razon, pazon]);
    return rows[0];
};

export const getTetelekByRendeles = async (razon) => {
    const sql = `
        SELECT 
            t.razon,
            t.pazon,
            p.pnev,
            p.par,
            t.db,
            (t.db * p.par) AS osszeg
        FROM tetel t
        INNER JOIN pizza p ON t.pazon = p.pazon
        WHERE t.razon = ?
        ORDER BY t.pazon
    `;
    const [rows] = await pool.execute(sql, [razon]);
    return rows;
};

export const insertTetel = async ({ razon, pazon, db }) => {
    const sql = `
        INSERT INTO tetel (razon, pazon, db)
        VALUES (?, ?, ?)
    `;
    const [result] = await pool.execute(sql, [razon, pazon, db]);
    return result;
};

export const updateTetel = async (razon, pazon, db) => {
    const sql = `
        UPDATE tetel
        SET db = ?
        WHERE razon = ? AND pazon = ?
    `;
    const [result] = await pool.execute(sql, [db, razon, pazon]);
    return result;
};

export const deleteTetel = async (razon, pazon) => {
    const sql = `
        DELETE FROM tetel
        WHERE razon = ? AND pazon = ?
    `;
    const [result] = await pool.execute(sql, [razon, pazon]);
    return result;
};
