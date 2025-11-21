import pool from '../db.js';

export const getAllCustomers = async () => {
    const [rows] = await pool.execute('SELECT * FROM customers');
    return rows;
}
export const insertCustomer = async (customerData) => {
    const { Nev, Email, Cim, Telefon, Jelszo_String } = customerData;
    const sql = "INSERT INTO `customers` (`Vasarlo_ID`, `Nev`, `Email`, `Cim`, `Telefon`, `Jelszo_String`) VALUES (NULL, ?, ?, ?, ?, AES_ENCRYPT(?,'titkos'));";
    const [result] = await pool.execute(sql, [Nev, Email, Cim, Telefon, Jelszo_String]);
    return result;
}