import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

const database = pool.promise();

database
    .query('SELECT 1')
    .then(() => console.log('Conectado ao banco de dados com sucesso!'))
    .catch((err) => console.error('Erro ao conectar ao banco de dados:', err));

export default database;
