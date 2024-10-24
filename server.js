const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const axios = require('axios');
require('dotenv').config();

require('./config/initDB');

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

    // Validar datos de entrada
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

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

    // Validar datos de entrada
    if (!email || !password) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

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

// Endpoint para obtener todas las noticias desde la base de datos
app.get('/api/news', (req, res) => {
    db.query('SELECT * FROM news', (err, results) => {
        if (err) {
            console.error('Error fetching news:', err);
            return res.status(500).json({ error: 'Error fetching news.' });
        }
        res.json(results);
    });
});

// Endpoint para crear una nueva noticia en la base de datos
app.post('/api/news', (req, res) => {
    const { user_id, title, description, image_url } = req.body;

    if (!user_id || !title || !description) {
        return res.status(400).json({ error: 'Los campos user_id, title y description son obligatorios.' });
    }

    db.query('INSERT INTO news (user_id, title, description, image_url) VALUES (?, ?, ?, ?)', [user_id, title, description, image_url], (err, results) => {
        if (err) {
            console.error('Error creating news:', err);
            return res.status(500).json({ error: 'Error creating news.' });
        }
        res.status(201).json({ message: 'News created successfully!', newsId: results.insertId });
    });
});

// Endpoint para editar una noticia
app.put('/api/news/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, image_url } = req.body;

    // Validar datos de entrada
    if (!title || !description) {
        return res.status(400).json({ error: 'Los campos title y description son obligatorios.' });
    }

    db.query('UPDATE news SET title = ?, description = ?, image_url = ? WHERE id = ?', [title, description, image_url, id], (err, results) => {
        if (err) {
            console.error('Error updating news:', err);
            return res.status(500).json({ error: 'Error updating news.' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'News not found.' });
        }
        res.json({ message: 'News updated successfully!' });
    });
});

// Endpoint para eliminar una noticia
app.delete('/api/news/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM news WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error deleting news:', err);
            return res.status(500).json({ error: 'Error deleting news.' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'News not found.' });
        }
        res.json({ message: 'News deleted successfully!' });
    });
});

// Endpoint para obtener noticias desde la API externa
app.get('/api/external-news', async (req, res) => {
    const keyword = req.query.q || 'tecnología'; // Cambia 'tecnología' por un valor predeterminado si no se proporciona un término de búsqueda
    const apiKey = process.env.NEWS_API_KEY; // Cambiado a NEWS_API_KEY

    try {
        const response = await axios.get(`https://newsapi.org/v2/everything?q=${keyword}&apiKey=${apiKey}`);
        const articles = response.data.articles;

        // Devuelve solo algunos campos para simplificar
        const formattedArticles = articles.map(article => ({
            title: article.title,
            description: article.description,
            url: article.url,
            imageUrl: article.urlToImage,
        }));

        res.json(formattedArticles);
    } catch (error) {
        console.error('Error fetching external news:', error);
        res.status(500).json({ error: 'Error fetching external news.' });
    }
});

// Inicio del servidor
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
