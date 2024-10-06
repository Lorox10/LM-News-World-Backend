// Importa las dependencias necesarias
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

// Crea una instancia de Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint para obtener noticias
app.get('/api/news', async (req, res) => {
    const { keyword } = req.query;
    const newsApiKey = process.env.NEWS_API_KEY;

    // Verifica si la clave está correctamente cargada
    console.log('News API Key:', newsApiKey); // Agrega esta línea para verificar

    try {
        const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&q=${keyword}&apiKey=${newsApiKey}`);
        res.json(response.data);
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).send('Error fetching news');
    }
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
