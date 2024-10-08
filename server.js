const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Crea una instancia de Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configura la conexión a la base de datos MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Conectar a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database.');
});

// Rutas de autenticación
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], (err, results) => {
        if (err) {
            console.error('Error registering user:', err);
            return res.status(500).json({ error: 'Error registering user.' });
        }
        res.status(201).json({ message: 'User registered successfully!' });
    });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) {
            console.error('Error logging in:', err);
            return res.status(500).json({ error: 'Error logging in.' });
        }
        if (results.length > 0) {
            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                return res.status(200).json({ message: 'Login successful!' });
            }
            return res.status(401).json({ error: 'Invalid credentials.' });
        }
        res.status(404).json({ error: 'User not found.' });
    });
});

// Rutas de noticias
app.get('/api/news', async (req, res) => {
    const keyword = req.query.keyword || '';
    const url = `https://newsapi.org/v2/everything?q=${keyword}&apiKey=${process.env.NEWS_API_KEY}`;

    try {
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ error: 'Error fetching news.' });
    }
});

// Inicio del servidor
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
s