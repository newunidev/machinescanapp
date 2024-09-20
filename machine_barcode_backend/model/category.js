const {DataTypes} = require('sequelize');
const sequelize = require('../database');

const Category = sequelize.define('Category',{
    cat_id:{
        type : DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false,
        unique:true,
    },
    cat_name:{
        type:DataTypes.STRING,
        allowNull:false,
        
    },


});

module.exports = Category;

