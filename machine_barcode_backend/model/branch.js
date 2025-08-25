const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // adjust path to your sequelize instance

const Branch = sequelize.define('Branch', {
  branch_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  branch_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true, // no duplicate branch names
  },
  location: {
    type: DataTypes.STRING(255), // optional, you can store city/location
    allowNull: true,
  },
  contact_number: {
    type: DataTypes.STRING(15),
    allowNull: true,
    validate: {
      isNumeric: true,
      len: [10, 15],
    },
  },
}, {
  tableName: 'branch',
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
  timestamps: true, // createdAt & updatedAt
});

module.exports = Branch;