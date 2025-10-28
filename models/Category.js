const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database.js');
const Category = sequelize.define(
    'Category',
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        orderIndex:{
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }
);
module.exports = Category;