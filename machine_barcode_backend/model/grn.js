const { DataTypes } = require("sequelize");
const sequelize = require("../database"); // Adjust path as per your setup
const PurchaseOrder = require("./purchaseorder");
const Employee = require("./employee");

const GRN = sequelize.define(
  "GRN",
  {
    grn_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
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
    grn_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Employee,
        key: "employee_id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
    additional: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "grn",

    timestamps: true, // Adds createdAt and updatedAt
    indexes: [
      { fields: ["po_id"] }, // index for faster purchase order lookups
      { fields: ["created_by"] }, // index for faster creator lookups
      { fields: ["grn_date"] }, // index for faster date filtering
    ],
  }
);
// Associations
GRN.belongsTo(PurchaseOrder, {
  foreignKey: "po_id",
  targetKey: "POID",
});

GRN.belongsTo(Employee, {
  foreignKey: "created_by",
  targetKey: "employee_id",
});

 

module.exports = GRN;
