const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const RentMachine = require("./rent_machine");
const PurchaseOrder = require("./purchaseorder");
const CategoryPurchaseOrder = require("./category_purchaseorder");
const GRN = require("./grn");

const RentMachineLife = sequelize.define(
  "RentMachineLife",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
    cpo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: CategoryPurchaseOrder,
        key: "cpo_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    grn_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Can be null if GRN not yet created
      references: {
        model: GRN,
        key: "grn_id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    branch: {
      type: DataTypes.STRING,
      allowNull: false,
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
    indexes: [
      { fields: ["po_id"] },
      { fields: ["cpo_id"] },
      { fields: ["grn_id"] },
      { fields: ["branch"] },
      { fields: ["rent_item_id"] },
    ],
  }
);

// Associations
RentMachineLife.belongsTo(PurchaseOrder, {
  foreignKey: "po_id",
  targetKey: "POID",
});

RentMachineLife.belongsTo(CategoryPurchaseOrder, {
  foreignKey: "cpo_id",
  targetKey: "cpo_id",
});

RentMachineLife.belongsTo(GRN, {
  foreignKey: "grn_id",
  targetKey: "grn_id",
});

RentMachineLife.belongsTo(RentMachine, {
  foreignKey: "rent_item_id",
  targetKey: "rent_item_id",
});

module.exports = RentMachineLife;
