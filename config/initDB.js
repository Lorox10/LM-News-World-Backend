const mysql = require('mysql2');
require('dotenv').config();

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

// Crear tablas si no existen
const createTables = () => {
    const userTable = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL
        );
    `;

    const newsTable = `
        CREATE TABLE IF NOT EXISTS news (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            title VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            image_url VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
    `;

    db.query(userTable, (err) => {
        if (err) {
            console.error('Error creating users table:', err);
            return;
        }
        console.log('Users table created or already exists.');
    });

    db.query(newsTable, (err) => {
        if (err) {
            console.error('Error creating news table:', err);
            return;
        }
        console.log('News table created or already exists.');
    });
};

// Conectar a la base de datos y crear las tablas
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database. Initializing tables...');
    createTables();
});
