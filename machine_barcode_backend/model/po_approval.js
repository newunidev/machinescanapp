const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const PurchaseOrder = require("./purchaseorder");
const Employee = require("./employee");

const POApproval = sequelize.define("POApproval", {
  po_app_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  po_no: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: PurchaseOrder,
      key: "POID",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
  approval1: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  approval1_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Employee,
      key: "employee_id",
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  },
  approved1_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  approval2: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  approval2_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Employee,
      key: "employee_id",
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  },
  approved2_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: "po_approvals",
  timestamps: true,
});

// Associations
POApproval.belongsTo(PurchaseOrder, { foreignKey: "po_no", targetKey: "POID" });
POApproval.belongsTo(Employee, { foreignKey: "approval1_by", as: "FirstApprover" });
POApproval.belongsTo(Employee, { foreignKey: "approval2_by", as: "SecondApprover" });

module.exports = POApproval;
