const express = require('express');
const router = express.Router();
const { deleteNews, updateNews, getAllNews, createNews } = require('../controllers/newsController'); // Ajusta la ruta según tu estructura

// Obtener todas las noticias
router.get('/news', getAllNews);

// Crear una nueva noticia
router.post('/news', createNews);

// Actualizar una noticia
router.put('/news/:id', updateNews);

// Eliminar una noticia
router.delete('/news/:id', deleteNews);

module.exports = router;
