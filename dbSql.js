// dbSql.js
import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER, // e.g., 'clouddbserver123.database.windows.net'
    database: process.env.DB_NAME,
    options: {
        encrypt: true, // Use encryption
        trustServerCertificate: false, // Change to true for local dev / self-signed certs
    },
};

const connectSQL = async () => {
    try {
        await sql.connect(dbConfig);
        console.log('Connected to Azure SQL Database');
    } catch (err) {
        console.error('Database connection failed:', err);
    }
};

export default connectSQL;
