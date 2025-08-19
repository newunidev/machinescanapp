const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const PurchaseOrder = require("./purchaseorder");
const Employee = require("./employee");

const POPrintPool = sequelize.define(
  "POPrintPool",
  {
    printId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    po_id: {
      type: DataTypes.STRING, // since PurchaseOrder.POID is a STRING
      allowNull: false,
      references: {
        model: PurchaseOrder,
        key: "POID",
      },
    },
    first_print: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    print_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    printed_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Employee,
        key: "employee_id",
      },
    },
    last_print_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "po_print_pool",
    timestamps: true, // includes createdAt and updatedAt
  }
);

// Associations
POPrintPool.belongsTo(PurchaseOrder, {
  foreignKey: "po_id",
  targetKey: "POID",
  onDelete: "CASCADE",
});

POPrintPool.belongsTo(Employee, {
  foreignKey: "printed_by",
  targetKey: "employee_id",
  onDelete: "CASCADE", // or "RESTRICT"
});
module.exports = POPrintPool;