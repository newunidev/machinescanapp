const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./database"); // Import the Sequelize instance

const fs = require("fs"); // Import the file system module
const path = require("path");
require("dotenv").config(); // Load env variables
const authenticateToken = require("./middleware/authMiddleware");

const Branch = require("./model/branch.js");
const Category = require("./model/category.js");
const Item = require("./model/item.js");
const ItemScan = require("./model/item_scan.js");
const Employee = require("./model/employee.js");
const ItemCountScan = require("./model/item_count_scan.js");
const ItemTransfer = require("./model/item_transfer.js");
const IdleScan = require("./model/idle_scan.js");
const ITAsset = require("./model/it_asset.js");
const ITCategory = require("./model/it_category.js");
const AssetUser = require("./model/asset_user.js");
const AssetAssignment = require("./model/asset_assignment.js");
const Permission = require("./model/permission.js");
const EmployeePermission = require("./model/employee_permission.js");
const Supplier = require("./model/supplier.js");
const RentMachine = require("./model/rent_machine.js");
// const RentMachineAllocation = require('./model/rent_machine_allocation.js');
// const RentMachineReturn = require('./model/rent_machine_return.js');
// const RentMachine_Renew = require('./model/rent_machine_renew.js');

// const RentMachineTime = require('./model/rent_machine_time.js');

//purchase order
const PurchaseOrder = require("./model/purchaseorder.js");
const CategoryPurchaseOrder = require("./model/category_purchaseorder.js");
const poMachineRenewal = require("./model/po_machine_renewal.js");
const RentMachineLife = require("./model/rent_machine_life.js");
const poApproval = require("./model/po_approval.js");
const Grn = require("./model/grn.js");
const GrnRentMachine = require("./model/grn_rent_machine.js");
const POPrintPool = require("./model/po_print_pool.js");
// Setup GRN-specific associations
const { setupGRNAssociations } = require("./model/association");


const BranchController = require("./controller/branchController.js");
const ItemController = require("./controller/itemController.js");
const ItemScanController = require("./controller/itemScanController.js");
const itemScanController = require("./controller/itemScanController.js");
const CategoryController = require("./controller/categoryController.js");
const EmployeeController = require("./controller/employeeController.js");
const ItemCountScanController = require("./controller/itemCountScanController.js");
const ItemTransferController = require("./controller/ItemTransferController.js");
const itemController = require("./controller/itemController.js");
const IdleScanController = require("./controller/idleScanController.js");
const itemCountScanController = require("./controller/itemCountScanController.js");
const ITAssetController = require("./controller/itAssetController.js");
const ItCategoryController = require("./controller/itCategoryController.js");
const AssetUserController = require("./controller/AssetUserController.js");
const AssetAssignmentController = require("./controller/assetAssignmentController.js");
const assetAssignmentController = require("./controller/assetAssignmentController.js");
const PermissionController = require("./controller/permissionController.js");

const EmployeePermissionController = require("./controller/employeePermissionController.js");

const supplierController = require("./controller/supplierController.js");

const rentMachineController = require("./controller/rentMachineController.js");
// const rentMachineAllocation = require('./controller/rentMachineAllocationController.js');
// const rentMachineAllocationController = require('./controller/rentMachineAllocationController.js');
// const rentMachineReturnController = require('./controller/rentMachineReturnController.js');
// const rentMachineRenewController = require('./controller/rentMachineRenewController.js');

// const rentMachineTimeController = require('./controller/rentMachineTimeController.js');

//purchase order
const PurchaseOrderController = require("./controller/purchaseOrderController.js");
const purchaseOrderController = require("./controller/purchaseOrderController.js");
const CategoryPurchaseOrderController = require("./controller/categoryPurchaseOrderController.js");
const categoryPurchaseOrderController = require("./controller/categoryPurchaseOrderController.js");
const POMachineRenewalController = require("./controller/poMachineRenewalController.js");
const poMachineRenewalController = require("./controller/poMachineRenewalController.js");
const rentMachineLifeController = require("./controller/rentMachineLifeController.js");
const poApprovalController = require("./controller/poApprovalController.js");
const grnController = require("./controller/grnController.js");
const grnRentMachineController = require("./controller/grnRentMachineController.js");
const poPrintPoolController = require("./controller/poPrintPoolController.js");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON and URL-encoded request bodies with increased payload size limit
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

//routing for branch

app.post("/branches", BranchController.createBranch);
app.get("/branches", BranchController.getAllBranches);

//routing for Item

app.post("/items", ItemController.createItem);
app.post("/createorupdateitems", ItemController.createOrUpdateItems);

app.get("/items", ItemController.getAllItems);
app.get("/itemsbyitemcode", ItemController.getItemByItemCode);
app.get("/itemsbybranch", ItemController.getItemsByBranchAndCategory);
app.get("/itemsatotalbybranch", ItemController.getTotalItemsByCategory);
app.get("/noofitems", ItemController.getTotalItemsByBranch);

//routing for ItemScan
app.post("/itemscans", ItemScanController.createItemScan);
app.get("/itemscans", itemScanController.getAllItemScans);
app.get(
  "/itemscansbybranchitemcategory",
  itemScanController.getItemScansByFilter
);
app.get("/itemscansunique", itemScanController.getUniqueCategoryCountToday);

//routing for category
app.get("/categories", CategoryController.getAllCategories);

//routing for employees
app.post("/employees", EmployeeController.createEmployee);
app.get("/login", EmployeeController.login);
app.put("/employepswupdate", EmployeeController.updatePasswordByEmail);
app.get("/employees",EmployeeController.getAllEmployees);
app.get("/employees-with-branch",EmployeeController.getAllEmployeesWithBranch);

//routing for itemcountScan
app.get("/itemcountscans", ItemCountScanController.getAllItemCountScans);
app.post("/itemcountscans", ItemCountScanController.createItemCountScan);
app.get(
  "/itemcountscansbybranchcurrentbranchdatecat",
  ItemCountScanController.getItemCountScansByFilterCurrentBranch
);
app.get(
  "/itemcountscanbyserailno",
  itemCountScanController.getItemCountsBySerialOrItemCode
);
app.get(
  "/itemcountscanslatest",
  itemCountScanController.getLatestItemCountScans
);
app.post(
  "/updateitemcountscanlatestcurrentbranch",
  itemCountScanController.updateLatestScanByItemId
);

//routing for itemTransfer
app.get("/itemtransfers", ItemTransferController.getAllTransfers);
app.post("/itemtransfers", ItemTransferController.createItemTransfer);
app.get(
  "/itemtranfersbybranch",
  ItemTransferController.getAllItemTransfersByBranch
);
app.get(
  "/itemtransfersbybranchrecent",
  ItemTransferController.getTransfersByPrevUsedBranch
);
app.put(
  "/itemtransferstatusupdate",
  ItemTransferController.updateItemTransferStatus
);
app.get(
  "/itemtransferbyitemcodewithpending",
  ItemTransferController.getTransferDetailsByItemCode
);
app.get(
  "/itemtransferspendingbybranch",
  ItemTransferController.getPendingTransfersByBranch
);
app.get(
  "/itemtransferssendingbranchbyitemcide",
  ItemTransferController.getSendingBranchByItemCode
);

//--machine transfer api for web
app.get(
  "/itemtransferbysendingandprev",
  ItemTransferController.getItemTransfersBySendingAndPreviousBranch
);

//routing for itemScanController
app.get("/idlescans", IdleScanController.getAllIdleScans);
app.post("/idlescans", IdleScanController.createIdleScan);
app.get("/idlescanbycategory", IdleScanController.getIdleScanCountByCategory);
app.get(
  "/idlescanbybranchdate",
  IdleScanController.getIdleScanCountByCategoryBranchDate
);
app.get(
  "/idlescanbycurrentbranchdatecat",
  IdleScanController.getIdleScansByFilterCurrentBranchOnly
);
app.get("/idelescanrecent", IdleScanController.getLatestIdleScans);
app.get(
  "/idlescancountbycategorylast3days",
  IdleScanController.getIdleScanCountByCategory3DaysBefore
);
app.get(
  "/idlescanuniquebylast2days",
  IdleScanController.getIdleScanByCategoryAndBranch3Days
);
app.get(
  "/idlescancountbycategoryTodaysDate",
  IdleScanController.getIdleScanCountByCategoryToday
);
app.get(
  "/idlescancountbycategoryBranch",
  IdleScanController.getIdleScanByCategoryAndBranchToday
);

//---------API for routing IT Assets Start //

app.post("/itassets", ITAssetController.createItAsset);
app.get("/itassets", ITAssetController.getAllItAssets);
app.post("/createorupdateitassets", ITAssetController.createOrUpdateItAssets);
app.get("/assetsbyassetcode", ITAssetController.getItAssetByAssetCode);
app.get("/itassetcountbycategory", ITAssetController.getItAssetCountByCategory);

//routing for itCateogry
app.post("/itcategories", ItCategoryController.createItCategory);
app.get("/itcategories", ItCategoryController.getAllItCategories);

//routing for assetUsers
app.post("/assetusers", AssetUserController.createAssetUser);
app.get("/assetusers", AssetUserController.getAllAssetUsers);
app.post("/assetusersbulk", AssetUserController.createOrUpdateAssetUsers);

//routing for asset Assignments
app.post("/assetassignments", AssetAssignmentController.createAssetAssignments);
app.get(
  "/assetassignmentsbyAssetId",
  assetAssignmentController.getAssetAssignmentsByAssetId
);
app.get("/assetassignments", AssetAssignmentController.getAllAssetAssignments);
app.get(
  "/assetassignmentcheckhascurrentuser",
  AssetAssignmentController.checkAssetAssignmentForCurrentUser
);
app.get("/assetsavaialable", AssetAssignmentController.getAvailableAssets);
app.get(
  "/assetAssignmentreturnupdate",
  AssetAssignmentController.updateReturnAssetAssignment
);
//END  ....////

//API Routing for Permission Start //
app.get("/permissions", PermissionController.getAllPermissions);
app.post("/permissions", PermissionController.createPermission);

app.post(
  "/employeepermissions",
  EmployeePermissionController.createEmployeePermission
);
app.get(
  "/employeepermissionsbyemployeid",
  EmployeePermissionController.getEmployeePermissionsByEmployeeId
);
app.get(
  "/employeepermissions",
  EmployeePermissionController.getAllEmployeePermissions
);
//END

//start for Rent Machine API calls//

app.get("/suppliers", supplierController.getAllSuppliers);
app.post("/suppliers", supplierController.createSupplier);

//api for rent machines
app.get(
  "/rentmachines",
  authenticateToken,
  rentMachineController.getAllRentMachines
);
app.post(
  "/rentmachines",
  
  rentMachineController.createRentMachine
);
app.get("/rentmachines-avaialable-to-grn",rentMachineController.getMachinesByStatus);

// //api for rent machine allocation
// app.post('/rentmachineallocations',rentMachineAllocationController.createAllocation);
// app.get('/rentmachineallocations',rentMachineAllocationController.getAllAllocations);

// //api for rent machine return
// app.post('/rentmachinereturns',rentMachineReturnController.createRentMachineReturn);
// app.get('/rentmachinereturns',rentMachineReturnController.getAllRentMachineReturns);

// //api for rent machine renew
// app.post('/rentmachinerenews',rentMachineRenewController.createRentMachineRenew);
// app.get('/rentmachinerenews',rentMachineRenewController.getAllRentMachineRenews);

// //api for rent machinetime

// app.post('/rentmachinetimes', rentMachineTimeController.createRentMachineTime);
// app.get('/rentmachinetimes', rentMachineTimeController.getAllRentMachineTimes);
// app.get('/rentmachinetimes/:id', rentMachineTimeController.getRentMachineTimeById);
// app.put('/rentmachinetimes/:id', rentMachineTimeController.updateRentMachineTime);

// PO Part start//

//api for purchase order
app.post("/purchaseorders", purchaseOrderController.createPurchaseOrder);
app.get("/purchaseorders", purchaseOrderController.getAllPurchaseOrders);
app.get("/purchaseordersbyid", purchaseOrderController.getPurchaseOrderById);
app.put("/purchaseorders-status",purchaseOrderController.updatePurchaseOrder);
app.put("/purchaseorders-entire",purchaseOrderController.updateEntirePurchaseOrder);

//api for popirntPool 
app.post("/poprintpools",poPrintPoolController.createPoPrintPool);
app.get("/poprintpools",poPrintPoolController.getAllPoPrintPools);
app.get("/poprintpoolsbyPoId",poPrintPoolController.getByPOId);
app.put("/poprinpools-bypoid",poPrintPoolController.updateByPOId);

//api for category purchase order
app.post(
  "/categorypurchaseoders",
  categoryPurchaseOrderController.createCategoryPurchaseOrder
);
app.get(
  "/categorypurchaseorders",
  categoryPurchaseOrderController.getAllCategoryPurchaseOrders
);
app.post(
  "/bulk-category-purchaseorders",
  categoryPurchaseOrderController.bulkCreateCategoryPurchaseOrders
);
app.post(
  "/bulk-category-purchaseorders-update",
  categoryPurchaseOrderController.bulkCreateAndUpdateCategoryPurchaseOrders
);
app.get(
  "/categorypurchaseordersbypoid",
  categoryPurchaseOrderController.getCategoryPurchaseOrdersByPOId
);

app.delete("/categorypurchaseorders/:id", categoryPurchaseOrderController.deleteCategoryPurchaseOrder);
app.put("/categorypurchaseorders/:id",categoryPurchaseOrderController.updateCategoryPurchaseOrder);

//api for po renewal machines
app.post(
  "/porenewalmachines",
  poMachineRenewalController.createPOMachineRenewal
);
app.get(
  "/porenewalmachines",
  poMachineRenewalController.getAllPOMachineRenewals
);

//api for rent machine life time
app.post("/rentmachinelifetimes", rentMachineLifeController.create);
app.get("/rentmachinelifetimes", rentMachineLifeController.getAll);
app.get("/rentmachinesexpired", rentMachineLifeController.getExpiredMachines);

//api for po approvals
app.post("/poapprovals", poApprovalController.createPOApproval);
app.get("/poapprovals", poApprovalController.getAllPOApprovals);
app.get("/po-approvals/poid",poApprovalController.getPOApprovalByPOID);
app.put("/po-approvals/approval1", poApprovalController.updateApproval1);
app.put("/po-approvals/approval2", poApprovalController.updateApproval2);

//api for grn
app.post("/grns",grnController.createGRN);
app.get("/grns",grnController.getAllGRNs);
app.get("/grns-rentmachine-cpo-bypoid",grnController.getGRNWithRentMachinesByPOId);
app.delete("/grnsdeletebyid", grnController.deleteGRN);

//api for grn rent machines
app.post("/grn-rent-machines",grnRentMachineController.createGRNRentMachine);
app.post("/grn-rent-machines-bulk",grnRentMachineController.bulkCreateGRNRentMachines);
app.get("/grn-rent-machines",grnRentMachineController.getAllGRNRentMachines);
app.get("/grn-rent-machines-byrentid",grnRentMachineController.getGRNRentMachinesByRentItemId);

//end of rent machine module api calles
setupGRNAssociations();
// Start the server
sequelize
  .sync({ force: false })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });

module.exports = app;
