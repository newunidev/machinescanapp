const { DataTypes, Op } = require('sequelize');
const sequelize = require('../database'); // Adjust the path if needed
const RentMachine = require('./rent_machine'); // Ensure this points to your RentMachine model

const RentMachineAllocation = sequelize.define('RentMachineAllocation', {
  rd_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  rent_item_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: RentMachine,
      key: 'rent_item_id',
    },
  },
  style_no: {
    type: DataTypes.STRING,
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
  status: {
    type: DataTypes.ENUM('Active', 'Inactive'),
    allowNull: false,
    validate: {
      isIn: {
        args: [['Active', 'Inactive']],
        msg: 'Status must be either "Active" or "Inactive"',
      },
    },
  },
  po_no: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  additional: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'rent_machine_allocations',
  timestamps: true,
});

// Prevent creating multiple Active allocations for the same rent_item_id
RentMachineAllocation.beforeCreate(async (allocation, options) => {
  if (allocation.status === 'Active') {
    const existing = await RentMachineAllocation.findOne({
      where: {
        rent_item_id: allocation.rent_item_id,
        status: 'Active',
      },
    });

    if (existing) {
      throw new Error('An active allocation already exists for this rent machine.');
    }
  }
});

// Optional: Also prevent updating to "Active" if another Active exists
RentMachineAllocation.beforeUpdate(async (allocation, options) => {
  if (allocation.status === 'Active') {
    const existing = await RentMachineAllocation.findOne({
      where: {
        rent_item_id: allocation.rent_item_id,
        status: 'Active',
        rd_id: { [Op.ne]: allocation.rd_id }, // Exclude current record
      },
    });

    if (existing) {
      throw new Error('Another active allocation already exists for this rent machine.');
    }
  }
});

// Association
RentMachineAllocation.belongsTo(RentMachine, { foreignKey: 'rent_item_id', targetKey: 'rent_item_id' });

module.exports = RentMachineAllocation;
