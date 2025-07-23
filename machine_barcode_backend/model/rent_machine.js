const { DataTypes, Op } = require('sequelize');
const sequelize = require('../database');
const Category = require('./category');
const Supplier = require('./supplier');


const RentMachine = sequelize.define('RentMachine', {
  rent_item_id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  serial_no: {
    type: DataTypes.STRING,
    allowNull: false,
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
      key: 'cat_id',
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
      key: 'supplier_id',
    },
  },
  additional: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'rent_machines',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['serial_no', 'rented_by'], // Prevent duplicate serial_no for same branch
    },
  ],
});

// Mapping function for rented_by branch code
const getBranchCode = (rentedBy) => {
  const map = {
    Bakamuna1: 'B1',
    Bakamuna2: 'B2',
    Hettipola: 'H',
    Welioya: 'W',
    Mathara: 'M',
    Piliyandala: 'P',
  };
  return map[rentedBy] || 'X';
};

RentMachine.beforeValidate(async (machine, options) => {
  if (!machine.rent_item_id && machine.serial_no && machine.rented_by) {
    const branchCode = getBranchCode(machine.rented_by);
    const prefix = `RENT${branchCode}`;

    // Find the last rent_item_id that matches this branch prefix
    const lastRecord = await RentMachine.findOne({
      where: {
        rent_item_id: {
          [Op.like]: `${prefix}%`
        }
      },
      order: [['rent_item_id', 'DESC']]
    });

    let nextNumber = 1;
    if (lastRecord && lastRecord.rent_item_id) {
      const lastId = lastRecord.rent_item_id;
      const numberPart = parseInt(lastId.replace(prefix, ''), 10);
      if (!isNaN(numberPart)) {
        nextNumber = numberPart + 1;
      }
    }

    const paddedNumber = nextNumber.toString().padStart(6, '0');
    machine.rent_item_id = `${prefix}${paddedNumber}`;
  }
});

RentMachine.belongsTo(Category, { foreignKey: 'cat_id', targetKey: 'cat_id' });
RentMachine.belongsTo(Supplier, { foreignKey: 'sup_id', targetKey: 'supplier_id' });



module.exports = RentMachine;
