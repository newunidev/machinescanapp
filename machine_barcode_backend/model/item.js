const { DataTypes, Op, STRING } = require('sequelize');
const sequelize = require('../database'); // Adjust path based on your setup
const Category = require('./category');   // Assuming Category model is in the same directory

const Item = sequelize.define('Item', {
  item_code: {
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
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  branch: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  box_no :{
    type: DataTypes.STRING(255),
    allowNull:true,
  },
  model_no:{
    type:DataTypes.STRING(255),
    allowNull:true,
  },
  motor_no:{
    type:DataTypes.STRING(255),
    allowNull:true,
  },
  cat_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Category,  // Reference to the Category model
      key: 'cat_id'
    }
  },
  
  supplier:{
    type: DataTypes.STRING,
    allowNull:true,
  },
  brand:{
    type: DataTypes.STRING,
    allowNull:true,
  },
  condition:{
    type:STRING,
    allowNull:true,
  },
  import_date:{
    type:DataTypes.DATEONLY,
    allowNull:true,
  },
}, {
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
});

// Before validate hook to set item_code based on branch
Item.beforeValidate(async (item, options) => {
  if (!item.item_code) {
    let prefix = 'ITM';  // All item codes should start with 'ITM'
    
    // Determine the suffix based on the branch
    let branchSuffix = '';
    switch (item.branch) {
      case 'Hettipola':
        branchSuffix = 'H';
        break;
      case 'Mathara':
        branchSuffix = 'M';
        break;
      case 'Welioya':
        branchSuffix = 'W';
        break;
      case 'Bakamuna1':
        branchSuffix = 'B1';
        break;
      case 'Bakamuna2':
        branchSuffix = 'B2';
        break;
      case 'Sample Room':
        branchSuffix = 'SR';
        break;
      default:
        throw new Error('Unknown branch');
    }

    // Find the last item_code with the same branch prefix
    const lastItem = await Item.findOne({
      where: {
        item_code: {
          [Op.like]: `${prefix}${branchSuffix}%`
        }
      },
      order: [['item_code', 'DESC']]
    });

    if (lastItem) {
      const lastItemCode = lastItem.item_code;
      const lastItemNumber = parseInt(lastItemCode.replace(`${prefix}${branchSuffix}`, ''), 10);
      const nextItemNumber = lastItemNumber + 1;
      item.item_code = `${prefix}${branchSuffix}${nextItemNumber.toString().padStart(3, '0')}`;
    } else {
      item.item_code = `${prefix}${branchSuffix}001`;
    }
  }
});

// Associate Item with Category using cat_id as the foreign key
Item.belongsTo(Category, { foreignKey: 'cat_id', targetKey: 'cat_id' });

module.exports = Item;
