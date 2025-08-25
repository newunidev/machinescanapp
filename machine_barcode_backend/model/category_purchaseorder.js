const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const PurchaseOrder = require("./purchaseorder");
const Category = require("./category");

const CategoryPurchaseOrder = sequelize.define(
  "CategoryPurchaseOrder",
  {
    cpo_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    PO_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: PurchaseOrder,
        key: "POID",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
    cat_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Category,
        key: "cat_id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
    Qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    PerDay_Cost: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    d_percent: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    from_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    to_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    
  },
  {
    tableName: "category_purchase_orders",
    timestamps: true,
    indexes: [
      {
        name: "idx_po_id",
        fields: ["PO_id"],
      },
      {
        name: "idx_cat_id",
        fields: ["cat_id"],
      },
      {
        name: "idx_from_date",
        fields: ["from_date"],
      },
      {
        name: "idx_to_date",
        fields: ["to_date"],
      },
      {
        name: "idx_po_cat",
        fields: ["PO_id", "cat_id"], // composite index
      },
    ],
  }
);

// Define associations if needed
CategoryPurchaseOrder.belongsTo(PurchaseOrder, { foreignKey: "PO_id", targetKey: "POID" });
CategoryPurchaseOrder.belongsTo(Category, { foreignKey: "cat_id", targetKey: "cat_id" });

module.exports = CategoryPurchaseOrder;
