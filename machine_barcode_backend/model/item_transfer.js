const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // Adjust path based on your setup
const Item = require('./item'); // Importing Item model
const Employee = require('./employee');

const ItemTransfer = sequelize.define('ItemTransfer', {
  item_transfer_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  item_id: {
    type: DataTypes.STRING(255),
    allowNull: false,
    references: {
      model: Item, // Reference to the Item model
      key: 'item_code',
    },
  },
  owner_branch: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  prev_used_branch: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  sending_branch: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  employee_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Employee, // Reference to the Employee model
      key: 'employee_id',
    },
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'Pending', // Example: Status can be 'Pending', 'Sent', 'Received'
  },
  accept_by: {
    type: DataTypes.STRING,
    allowNull: true, // Set null until accepted
  },
  arrived_date: {
    type: DataTypes.DATE,
    allowNull: true, // Set null until item arrives
  },
}, {
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
  timestamps: true, // Adds createdAt and updatedAt fields
});

// Associate ItemTransfer with Item using item_id as the foreign key
ItemTransfer.belongsTo(Item, { foreignKey: 'item_id', targetKey: 'item_code' });
// Associate ItemTransfer with Employee using employee_id as the foreign key
ItemTransfer.belongsTo(Employee, { foreignKey: 'employee_id', targetKey: 'employee_id' });

module.exports = ItemTransfer;
