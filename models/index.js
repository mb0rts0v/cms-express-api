const { sequelize } = require('../config/database'); 
const Category = require('./Category');
const ContentItem = require('./ContentItem');
const User = require('./User');

Category.hasMany(ContentItem, { 
    foreignKey: 'categoryId',
    as: 'items' 
});

ContentItem.belongsTo(Category, { foreignKey: 'categoryId' });

module.exports = {
    sequelize,
    Category,
    ContentItem,
    User
};