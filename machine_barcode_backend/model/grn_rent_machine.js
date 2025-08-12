const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const GRN = require("./grn");
const CategoryPurchaseOrder = require("./category_purchaseorder");
const RentMachine = require("./rent_machine");

const GRN_RentMachine = sequelize.define(
  "GRN_RentMachine",
  {
    g_rm_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    grn_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: GRN,
        key: "grn_id",
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
    additional: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "grn_rent_machines",
    timestamps: true,
    indexes: [
      { fields: ["grn_id"] },
      { fields: ["cpo_id"] },
      { fields: ["rent_item_id"] },
    ],
  }
);

// Associations
 
GRN_RentMachine.belongsTo(CategoryPurchaseOrder, { foreignKey: "cpo_id", targetKey: "cpo_id" });
GRN_RentMachine.belongsTo(RentMachine, { foreignKey: "rent_item_id", targetKey: "rent_item_id" });
 

module.exports = GRN_RentMachine;
