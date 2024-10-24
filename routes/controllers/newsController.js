const News = require('../models/newsModel'); // Ajusta la ruta según tu estructura

// Obtener todas las noticias
const getAllNews = async (req, res) => {
    try {
        const news = await News.find();
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching news' });
    }
};

// Crear una nueva noticia
const createNews = async (req, res) => {
    const { user_id, title, description, image_url } = req.body;
    const newNews = new News({ user_id, title, description, image_url });
    
    try {
        await newNews.save();
        res.status(201).json(newNews);
    } catch (error) {
        res.status(400).json({ message: 'Error creating news' });
    }
};

// Actualizar una noticia
const updateNews = async (req, res) => {
    const { id } = req.params;
    const { title, description, image_url } = req.body;

    try {
        const updatedNews = await News.findByIdAndUpdate(id, { title, description, image_url }, { new: true });
        if (!updatedNews) {
            return res.status(404).json({ message: 'News not found' });
        }
        res.json(updatedNews);
    } catch (error) {
        res.status(400).json({ message: 'Error updating news' });
    }
};

// Eliminar una noticia
const deleteNews = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedNews = await News.findByIdAndDelete(id);
        if (!deletedNews) {
            return res.status(404).json({ message: 'News not found' });
        }
        res.status(204).send(); 
    } catch (error) {
        res.status(500).json({ message: 'Error deleting news' });
    }
};

module.exports = { getAllNews, createNews, updateNews, deleteNews };
