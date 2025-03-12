const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Employee = require('../model/employee');
const Permission = require('../model/permission');

const EmployeePermission = sequelize.define('EmployeePermission', {
  EMPPID: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  employee_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Employee,
      key: 'employee_id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  perm_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Permission,
      key: 'Perm_id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'employee_permissions',
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
});

// Auto-generate EMPPID with suffix
EmployeePermission.beforeValidate(async (empPerm, options) => {
  if (!empPerm.EMPPID) {
    const lastEmpPerm = await EmployeePermission.findOne({
      order: [['EMPPID', 'DESC']]
    });

    if (lastEmpPerm) {
      const lastEmpPid = lastEmpPerm.EMPPID;
      const lastNumber = parseInt(lastEmpPid.replace('EMPP', ''), 10);
      const nextNumber = lastNumber + 1;
      empPerm.EMPPID = `EMPP${nextNumber.toString().padStart(3, '0')}`;
    } else {
      empPerm.EMPPID = 'EMPP001';
    }
  }
});

// Associations
Employee.hasMany(EmployeePermission, { foreignKey: 'employee_id' });
Permission.hasMany(EmployeePermission, { foreignKey: 'perm_id' });
EmployeePermission.belongsTo(Employee, { foreignKey: 'employee_id' });
EmployeePermission.belongsTo(Permission, { foreignKey: 'perm_id' });

module.exports = EmployeePermission;
