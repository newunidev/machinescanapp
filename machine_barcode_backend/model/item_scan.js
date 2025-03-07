const { DataTypes } = require('sequelize');
const sequelize = require('../database');  // Adjust path based on your setup
const Category = require('./category');   // Assuming Category model is in the same directory
const Item = require('./item');           // Assuming Item model is in the same directory

const ItemScan = sequelize.define('ItemScan', {
  item_scan_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Category,  // Reference to Category model
      key: 'cat_id'
    }
  },
  item_id: {
    type: DataTypes.STRING(255), // Assuming `item_id` is the `item_code` from Item model
    allowNull: false,
    references: {
      model: Item,  // Reference to Item model
      key: 'item_code'
    }
  },
  scanned_date: {
    type: DataTypes.DATEONLY,  // Use DATEONLY if you want to ignore the time part
    allowNull: false,
  },
  branch: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
  indexes: [
    {
      unique: true,
      fields: ['item_id', 'scanned_date'],  // Define the composite unique index
    },
  ],
});

// Associate ItemScan with Category and Item
ItemScan.belongsTo(Category, { foreignKey: 'category_id' });
ItemScan.belongsTo(Item, { foreignKey: 'item_id' });

module.exports = ItemScan;
