const { DataTypes, Op } = require('sequelize');
const sequelize = require('../database'); // Adjust path based on your setup
const ITCategory = require('../model/it_category'); // Import ITCategory model
 

const ITAsset = sequelize.define('ITAsset', {
  asset_id: {
    type: DataTypes.STRING(255),
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  serial_no: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  brand: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  processor: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  os: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  storage: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  ram: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  virus_guard: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  condition: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  supplier: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  itCategoryId: {
    type: DataTypes.INTEGER,
    allowNull: false, // Ensure NOT NULL
    references: {
      model: ITCategory,
      key: 'cat_id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT', // Prevent deletion if there are assets associated with the category
  },
}, {
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
});

// Auto-generate asset_id with 'ITMIT' prefix
ITAsset.beforeValidate(async (asset, options) => {
  if (!asset.asset_id) {
    let prefix = 'ITMIT'; // Fixed prefix

    // Find the last asset_id that starts with 'ITMIT'
    const lastAsset = await ITAsset.findOne({
      where: {
        asset_id: {
          [Op.like]: `${prefix}%`
        }
      },
      order: [['asset_id', 'DESC']]
    });

    if (lastAsset) {
      const lastAssetCode = lastAsset.asset_id;
      const lastAssetNumber = parseInt(lastAssetCode.replace(prefix, ''), 10);
      const nextAssetNumber = lastAssetNumber + 1;
      asset.asset_id = `${prefix}${nextAssetNumber.toString().padStart(3, '0')}`;
    } else {
      asset.asset_id = `${prefix}001`;
    }
  }
});

// Define associations
ITCategory.hasMany(ITAsset, { foreignKey: 'itCategoryId' });
ITAsset.belongsTo(ITCategory, { foreignKey: 'itCategoryId' });

 
 
module.exports = ITAsset;
