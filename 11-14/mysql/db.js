import 'dotenv/config'; 
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER ||'root',
    password: process.env.DB_PASSWORD ||'',
    database: process.env.DATABASE || 'user_db',
    port: process.env.port || 3307,
    connectionLimit: 10,
    connectionTimeout: 10000,
    queueLimit: 0

});

export default pool;
