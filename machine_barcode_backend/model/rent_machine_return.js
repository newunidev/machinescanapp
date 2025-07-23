const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const RentMachine = require('./rent_machine'); // Adjust the path if needed

const RentMachine_Return = sequelize.define('RentMachine_Return', {
  return_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  rent_item_id: {
    type: DataTypes.STRING(255),
    allowNull: false,
    references: {
      model: RentMachine,
      key: 'rent_item_id', // Ensure this matches the PK in RentMachine
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
  return_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  Additional1: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  Additional2: {
    type: DataTypes.STRING(255),
    allowNull: true,
  }
}, {
  tableName: 'RentMachine_Return',
  timestamps: false,
});

RentMachine_Return.belongsTo(RentMachine, {
  foreignKey: 'rent_item_id',
  targetKey: 'rent_item_id',
  onUpdate: 'CASCADE',
  onDelete: 'RESTRICT',
});

 

module.exports = RentMachine_Return;
