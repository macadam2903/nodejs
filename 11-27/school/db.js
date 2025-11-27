import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'school'
};

const pool = mysql.createPool(dbConfig);

export default pool;
