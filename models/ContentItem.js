const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database.js');
const ContentItem = sequelize.define(
    'ContentItem',
    {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description:{
            type: DataTypes.TEXT,
        },
        price:{
            type: DataTypes.FLOAT,
        },
        imageUrl:{
            type: DataTypes.STRING,
        }
    }
);
module.exports = ContentItem;