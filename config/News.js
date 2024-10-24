const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const News = sequelize.define('News', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  image_url: {
    type: DataTypes.STRING
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

// Relación: una noticia pertenece a un usuario
News.belongsTo(User, { foreignKey: 'user_id' });

module.exports = News;
