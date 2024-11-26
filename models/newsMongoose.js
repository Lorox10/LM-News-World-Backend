const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    user_id: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image_url: { type: String, required: true }
});

const News = mongoose.model('News', newsSchema);

module.exports = News;
