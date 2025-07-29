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
      onDelete: "CASCADE",
    },
    cat_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Category,
        key: "cat_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
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
  },
  {
    tableName: "category_purchase_orders",
    timestamps: true,
  }
);

// Define associations if needed
CategoryPurchaseOrder.belongsTo(PurchaseOrder, { foreignKey: "PO_id", targetKey: "POID" });
CategoryPurchaseOrder.belongsTo(Category, { foreignKey: "cat_id", targetKey: "cat_id" });

module.exports = CategoryPurchaseOrder;
