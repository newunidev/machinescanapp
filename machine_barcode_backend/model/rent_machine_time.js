const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const RentMachine = require('./rent_machine');
const RentMachineReturn = require('./rent_machine_return');
const RentMachineRenew = require('./rent_machine_renew');

const RentMachineTime = sequelize.define('RentMachineTime', {
  rent_time_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  rent_item_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: RentMachine,
      key: 'rent_item_id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
  from_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  to_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  returned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    validate: {
      isBoolean(value) {
        if (typeof value !== 'boolean') {
          throw new Error("Returned must be a boolean");
        }
      },
    }
  },
  return_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: RentMachineReturn,
      key: 'return_id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
  renewed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    validate: {
      isBoolean(value) {
        if (typeof value !== 'boolean') {
          throw new Error("Renewed must be a boolean");
        }
      },
    }
  },
  renew_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: RentMachineRenew,
      key: 'renew_id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
  po_no: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'rent_machine_time',
  timestamps: false,
  validate: {
    cannotReturnAndRenew() {
      if (this.returned && this.renewed) {
        throw new Error("A rent record can't be both returned and renewed at the same time.");
      }
    }
  },
  hooks: {
    beforeCreate: async (rentTime, options) => {
      const existing = await RentMachineTime.findOne({
        where: {
          rent_item_id: rentTime.rent_item_id,
          returned: false,
          renewed: false,
        }
      });

      if (existing) {
        throw new Error("Cannot create a new record for this rent_item_id until the previous one is either returned or renewed.");
      }
    }
  }
});

// Associations
RentMachineTime.belongsTo(RentMachine, {
  foreignKey: 'rent_item_id',
  targetKey: 'rent_item_id'
});

RentMachineTime.belongsTo(RentMachineReturn, {
  foreignKey: 'return_id',
  targetKey: 'return_id'
});

RentMachineTime.belongsTo(RentMachineRenew, {
  foreignKey: 'renew_id',
  targetKey: 'renew_id'
});

module.exports = RentMachineTime;
