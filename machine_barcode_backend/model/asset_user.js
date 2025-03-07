const { DataTypes,Model  } = require('sequelize');
const sequelize = require('../database');
 

const AssetUser = sequelize.define('AssetUser', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  epf_no: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Ensure EPF number is unique
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  branch: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  designation: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date_of_joined: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  date_of_resigned: {
    type: DataTypes.DATE,
    allowNull: true, // Can be NULL if user is still active
  },
}, {
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
  timestamps: false, // Disable createdAt & updatedAt fields if not needed
});


 

module.exports = AssetUser;
