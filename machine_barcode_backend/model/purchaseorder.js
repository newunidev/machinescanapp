const { DataTypes, Op } = require("sequelize");
const sequelize = require("../database");
const Employee = require("./employee");
const Supplier = require("./supplier");

const PurchaseOrder = sequelize.define(
  "PurchaseOrder",
  {
    POID: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    invoice_to: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deliver_to: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    attention: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    payment_mode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    payment_term: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    instruction: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    pr_nos: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Employee,
        key: "employee_id",
      },
    },
    supplier_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Supplier,
        key: "supplier_id",
      },
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Pending",
    },
    branch: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "purchase_orders",
    timestamps: true,
  }
);

// Mapping function for branch code
const getBranchCode = (branch) => {
  const map = {
    Bakamuna1: "B1",
    Bakamuna2: "B2",
    Hettipola: "H",
    Welioya: "W",
    Mathara: "M",
    Piliyandala: "P",
  };
  return map[branch] || "X";
};

PurchaseOrder.beforeValidate(async (order, options) => {
  if (!order.POID && order.branch) {
    const year = new Date().getFullYear();
    const branchCode = getBranchCode(order.branch);
    const prefix = `${year}${branchCode}`;

    const lastOrder = await PurchaseOrder.findOne({
      where: {
        POID: {
          [Op.like]: `${prefix}/%`,
        },
      },
      order: [["POID", "DESC"]],
    });

    let nextNumber = 1;
    if (lastOrder && lastOrder.POID) {
      const numberPart = parseInt(lastOrder.POID.split("/")[1], 10);
      if (!isNaN(numberPart)) {
        nextNumber = numberPart + 1;
      }
    }

    const padded = nextNumber.toString().padStart(5, "0"); // 00001, 00002...
    order.POID = `${prefix}/${padded}`;
  }
});

PurchaseOrder.belongsTo(Employee, {
  foreignKey: "created_by",
  targetKey: "employee_id",
});

PurchaseOrder.belongsTo(Supplier, {
  foreignKey: "supplier_id",
  targetKey: "supplier_id",
});

module.exports = PurchaseOrder;
