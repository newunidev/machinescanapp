const { DataTypes, Op } = require("sequelize");
const sequelize = require("../database");
const Category = require("./category");
const Supplier = require("./supplier");

const RentMachine = sequelize.define(
  "RentMachine",
  {
    rent_item_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    serial_no: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Serial number must be globally unique
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    rented_by: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    box_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    model_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    motor_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cat_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Category,
        key: "cat_id",
      },
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    condition: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sup_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Supplier,
        key: "supplier_id",
      },
    },
    machine_status: {
      type: DataTypes.ENUM(
        "Available To Grn",
        "Available To Allocation",
        "In Allocation",
        "Pending Transfer",
        "Returned",
        "In Pending Renew PO"
      ),
      allowNull: false,
      defaultValue: "Available To Grn", // You can set the default status as needed
    },
  },
  {
    tableName: "rent_machines",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["serial_no"], // Serial number must be unique
      },
      {
        fields: ["name"], // for faster search by name
      },
      {
        fields: ["cat_id"], // category-based search
      },
      {
        fields: ["sup_id"], // supplier-based search
      },
    ],
  }
);

// ✅ Generate rent_item_id with global prefix NURENT
RentMachine.beforeValidate(async (machine, options) => {
  if (!machine.rent_item_id) {
    const prefix = "NURENT";

    // Find last ID with prefix
    const lastRecord = await RentMachine.findOne({
      where: {
        rent_item_id: {
          [Op.like]: `${prefix}%`,
        },
      },
      order: [["rent_item_id", "DESC"]],
    });

    let nextNumber = 1;
    if (lastRecord && lastRecord.rent_item_id) {
      const lastId = lastRecord.rent_item_id;
      const numberPart = parseInt(lastId.replace(prefix, ""), 10);
      if (!isNaN(numberPart)) {
        nextNumber = numberPart + 1;
      }
    }

    const paddedNumber = nextNumber.toString().padStart(7, "0");
    machine.rent_item_id = `${prefix}${paddedNumber}`;
  }
});

RentMachine.belongsTo(Category, { foreignKey: "cat_id", targetKey: "cat_id" });
RentMachine.belongsTo(Supplier, {
  foreignKey: "sup_id",
  targetKey: "supplier_id",
});

module.exports = RentMachine;
