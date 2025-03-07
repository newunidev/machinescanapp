const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // Adjust path based on your setup
const ITAsset = require('./it_asset'); // Adjust path
const AssetUser = require('./asset_user'); // Adjust path

const AssetAssignment = sequelize.define('AssetAssignment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  it_asset_id: {
    type: DataTypes.STRING(255),
    allowNull: false,
    references: {
      model: ITAsset,
      key: 'asset_id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  asset_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: AssetUser,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  assigned_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  returned_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  isCurrentUser: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
}, {
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
  timestamps: true,
});

 
//=----Associations

// In your AssetAssignment model (AssetAssignment.js):
AssetAssignment.belongsTo(AssetUser, { foreignKey: 'asset_user_id', as: 'users' });

// In your AssetUser model (AssetUser.js):
AssetUser.hasMany(AssetAssignment, { foreignKey: 'asset_user_id' });


//it assest association

// In your AssetAssignment model (AssetAssignment.js):
AssetAssignment.belongsTo(ITAsset, { foreignKey: 'it_asset_id', as: 'assets' });

// In your AssetUser model (AssetUser.js):
ITAsset.hasMany(AssetAssignment, { foreignKey: 'it_asset_id' });


module.exports = AssetAssignment;
