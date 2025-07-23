// model/rent_machine_renew.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const RentMachine = require('./rent_machine');

const RentMachineRenew = sequelize.define("RentMachineRenew", {
  renew_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  rent_item_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  renew_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  Additional1: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Additional2: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Additional3: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'rent_machine_renew', // Optional, but good for clarity
  timestamps: false
});

// Define association
RentMachineRenew.belongsTo(RentMachine, {
  foreignKey: 'rent_item_id',
  targetKey: 'rent_item_id',
  as: 'RentMachine'
});

module.exports = RentMachineRenew;
