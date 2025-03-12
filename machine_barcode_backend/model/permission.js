const { DataTypes } = require('sequelize');
const sequelize = require('../database');

 


const Permission = sequelize.define('Permission', {
  Perm_id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  Permission: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
});

Permission.beforeValidate(async (permission, options) => {
  if (!permission.Perm_id) {
    const lastPermission = await Permission.findOne({
      order: [['Perm_id', 'DESC']]
    });

    if (lastPermission) {
      const lastPermId = lastPermission.Perm_id;
      const lastPermNumber = parseInt(lastPermId.replace('PERM', ''), 10);
      const nextPermNumber = lastPermNumber + 1;
      permission.Perm_id = `PERM${nextPermNumber.toString().padStart(3, '0')}`;
    } else {
      permission.Perm_id = 'PERM001';
    }
  }
});


 

module.exports = Permission;
