import pool from "../db.js";    
export const getAllOrders = async () => {
    const [rows] = await pool.query('SELECT * FROM `orders` ');
    return rows;
};
export const getOrderById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM `orders` WHERE id = ?', [id]);
    return rows[0];
};