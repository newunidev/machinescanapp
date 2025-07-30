const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const RentMachine = require("./rent_machine");

const RentMachineLife = sequelize.define(
  "RentMachineLife",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    rent_item_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: RentMachine,
        key: "rent_item_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    from_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    to_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    tableName: "rent_machine_life",
    timestamps: true,
  }
);

// Associations
RentMachineLife.belongsTo(RentMachine, {
  foreignKey: "rent_item_id",
  targetKey: "rent_item_id",
});

module.exports = RentMachineLife;
