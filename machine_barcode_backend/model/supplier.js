const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // Adjust path based on your project structure

const Supplier = sequelize.define('Supplier', {
  supplier_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contact: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'suppliers', // Optional: explicitly name the table
  timestamps: true,       // Adds createdAt and updatedAt fields
});

module.exports = Supplier;
