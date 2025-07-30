const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const PurchaseOrder = require("./purchaseorder");
const RentMachine = require("./rent_machine");

const POMachineRenewal = sequelize.define(
  "POMachineRenewal",
  {
    mr_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    po_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: PurchaseOrder,
        key: "POID",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
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
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    perday_cost: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    d_percent: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    tableName: "po_machine_renewal",
    timestamps: true,
  }
);

// Associations
POMachineRenewal.belongsTo(PurchaseOrder, {
  foreignKey: "po_id",
  targetKey: "POID",
});
POMachineRenewal.belongsTo(RentMachine, {
  foreignKey: "rent_item_id",
  targetKey: "rent_item_id",
});

module.exports = POMachineRenewal;
