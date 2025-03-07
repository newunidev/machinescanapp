const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const ITAsset = require('../model/it_asset');


const ITCategory = sequelize.define('ITCategory', {
    cat_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true,
    },
    cat_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
});


 

module.exports = ITCategory;
