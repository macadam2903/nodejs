import pool from '../db.js';

export const getAllRendelesek = async () => {
    const sql = `
        SELECT 
            r.razon,
            r.vazon,
            v.vnev,
            r.fazon,
            f.fnev,
            r.idopont,
            COALESCE(SUM(t.db * p.par), 0) AS osszeg
        FROM rendeles r
        LEFT JOIN vevo v ON r.vazon = v.vazon
        LEFT JOIN futar f ON r.fazon = f.fazon
        LEFT JOIN tetel t ON r.razon = t.razon
        LEFT JOIN pizza p ON t.pazon = p.pazon
        GROUP BY r.razon, r.vazon, v.vnev, r.fazon, f.fnev, r.idopont
        ORDER BY r.razon
    `;
    const [rows] = await pool.execute(sql);
    return rows;
};

export const getRendelesById = async (razon) => {
    const sql = `
        SELECT 
            r.razon,
            r.vazon,
            v.vnev,
            v.vcim,
            r.fazon,
            f.fnev,
            f.ftel,
            r.idopont,
            COALESCE(SUM(t.db * p.par), 0) AS osszeg
        FROM rendeles r
        LEFT JOIN vevo v ON r.vazon = v.vazon
        LEFT JOIN futar f ON r.fazon = f.fazon
        LEFT JOIN tetel t ON r.razon = t.razon
        LEFT JOIN pizza p ON t.pazon = p.pazon
        WHERE r.razon = ?
        GROUP BY r.razon, r.vazon, v.vnev, v.vcim, r.fazon, f.fnev, f.ftel, r.idopont
    `;
    const [rows] = await pool.execute(sql, [razon]);
    return rows[0];
};

export const insertRendeles = async (rendelesData) => {
    const { vazon, fazon, idopont } = rendelesData;
    const sql = 'INSERT INTO rendeles (vazon, fazon, idopont) VALUES (?, ?, ?)';
    const [result] = await pool.execute(sql, [vazon, fazon, idopont]);
    return result;
};

export const deleteRendeles = async (razon) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        await connection.execute('DELETE FROM tetel WHERE razon = ?', [razon]);
        const [result] = await connection.execute('DELETE FROM rendeles WHERE razon = ?', [razon]);
        
        await connection.commit();
        return result;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};