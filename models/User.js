const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database.js');

const bcryptjs = require('bcryptjs'); 
const saltRounds = 10;
const User = sequelize.define(
    'User',
    {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password:{
            type: DataTypes.STRING,
        }
    }
);

User.beforeCreate(async (user) => {
    const hashedPassword = await bcryptjs.hash(user.password, saltRounds);

    user.password = hashedPassword;
});
module.exports = User;