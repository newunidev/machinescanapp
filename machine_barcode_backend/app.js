const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./database'); // Import the Sequelize instance
 
const fs = require('fs'); // Import the file system module
const path = require('path');
 

const Category = require('./model/category.js');
const Item = require('./model/item.js'); 
const ItemScan = require('./model/item_scan.js');
const Employee = require('./model/employee.js');
const ItemCountScan = require('./model/item_count_scan.js');
const ItemTransfer = require('./model/item_transfer.js');
const IdleScan = require('./model/idle_scan.js');
const ITAsset = require('./model/it_asset.js');
const ITCategory = require('./model/it_category.js');
const AssetUser = require('./model/asset_user.js');
const AssetAssignment = require('./model/asset_assignment.js');


const ItemController = require('./controller/itemController.js');
const ItemScanController = require('./controller/itemScanController.js');
const itemScanController = require('./controller/itemScanController.js');
const CategoryController = require('./controller/categoryController.js');
const EmployeeController = require('./controller/employeeController.js');
const ItemCountScanController = require('./controller/itemCountScanController.js');
const ItemTransferController = require('./controller/ItemTransferController.js');
const itemController = require('./controller/itemController.js');
const IdleScanController = require('./controller/idleScanController.js');
const itemCountScanController = require('./controller/itemCountScanController.js');
const ITAssetController = require('./controller/itAssetController.js');
const ItCategoryController = require('./controller/itCategoryController.js');
const AssetUserController = require('./controller/AssetUserController.js');
const AssetAssignmentController = require('./controller/assetAssignmentController.js');
const assetAssignmentController = require('./controller/assetAssignmentController.js');

 
 

const app = express();
const PORT = process.env.PORT || 3000;



// Middleware to parse JSON and URL-encoded request bodies with increased payload size limit
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

//routing for Item

app.post('/items',ItemController.createItem);
app.post('/createorupdateitems',ItemController.createOrUpdateItems);

app.get('/items',ItemController.getAllItems);
app.get('/itemsbyitemcode',ItemController.getItemByItemCode);
app.get('/itemsbybranch',ItemController.getItemsByBranchAndCategory);
app.get('/itemsatotalbybranch',ItemController.getTotalItemsByCategory);
app.get('/noofitems',ItemController.getTotalItemsByBranch);

//routing for ItemScan
app.post('/itemscans',ItemScanController.createItemScan);
app.get('/itemscans',itemScanController.getAllItemScans);
app.get('/itemscansbybranchitemcategory',itemScanController.getItemScansByFilter);

 

//routing for category 
app.get('/categories',CategoryController.getAllCategories);



//routing for employees
app.post('/employees',EmployeeController.createEmployee);
app.get('/login',EmployeeController.login);


//routing for itemcountScan 
app.get('/itemcountscans',ItemCountScanController.getAllItemCountScans);
app.post('/itemcountscans',ItemCountScanController.createItemCountScan);
app.get('/itemcountscansbybranchcurrentbranchdatecat',ItemCountScanController.getItemCountScansByFilterCurrentBranch);
app.get('/itemcountscanbyserailno',itemCountScanController.getItemCountsBySerialOrItemCode);



//routing for itemTransfer
app.get('/itemtransfers',ItemTransferController.getAllTransfers);
app.post('/itemtransfers',ItemTransferController.createItemTransfer);
app.get('/itemtranfersbybranch',ItemTransferController.getAllItemTransfersByBranch);


//routing for itemScanController
app.get('/idlescans',IdleScanController.getAllIdleScans);
app.post('/idlescans',IdleScanController.createIdleScan);
app.get('/idlescanbycategory',IdleScanController.getIdleScanCountByCategory);
app.get('/idlescanbybranchdate',IdleScanController.getIdleScanCountByCategoryBranchDate);
app.get('/idlescanbycurrentbranchdatecat',IdleScanController.getIdleScansByFilterCurrentBranchOnly);



//---------API for routing IT Assets Start //

app.post('/itassets',ITAssetController.createItAsset);
app.get('/itassets',ITAssetController.getAllItAssets);
app.post('/createorupdateitassets',ITAssetController.createOrUpdateItAssets);
app.get('/assetsbyassetcode',ITAssetController.getItAssetByAssetCode);

//routing for itCateogry
app.post('/itcategories',ItCategoryController.createItCategory);
app.get('/itcategories',ItCategoryController.getAllItCategories);


//routing for assetUsers
app.post('/assetusers',AssetUserController.createAssetUser);
app.get('/assetusers',AssetUserController.getAllAssetUsers);
app.post('/assetusersbulk',AssetUserController.createOrUpdateAssetUsers);

//routing for asset Assignments
app.post('/assetassignments',AssetAssignmentController.createAssetAssignments);
app.get('/assetassignments',assetAssignmentController.getAssetAssignmentsByAssetId);

//END  ....////



// Start the server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Error syncing database:', err);
});

module.exports = app;