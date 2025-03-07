const Category = require('../model/category');
const Item = require('../model/item');
const ItemCountScan = require('../model/item_count_scan');
const { Op } = require('sequelize'); // Assuming you have an ItemCountScan model

class ItemCountScanController {
  // Method to create a new ItemCountScan
  async createItemCountScan(req, res) {
    try {
      const { category_id, item_id, scanned_date, branch, current_branch } = req.body;
  
      // Ensure the category exists
      const category = await Category.findByPk(category_id);
      if (!category) {
        return res.status(400).json({
          success: false,
          message: 'Category not found',
        });
      }
  
      // Ensure the item exists
      const item = await Item.findByPk(item_id);
      if (!item) {
        return res.status(400).json({
          success: false,
          message: 'Item not found',
        });
      }
  
      // Convert scanned_date to Date object and set time to 00:00:00
      const scannedDate = new Date(scanned_date);
      scannedDate.setHours(0, 0, 0, 0);  // Set time to midnight
  
      // Create the new item count scan
      const newItemCountScan = await ItemCountScan.create({ 
        category_id, 
        item_id, 
        scanned_date: scannedDate, 
        branch, 
        current_branch 
      });
  
      res.status(200).json({
        success: true,
        message: 'Item count scan created successfully',
        itemCountScanCreated: newItemCountScan,
      });
       
    } catch (error) {
        console.error('Error creating item count scan:', error);
      
        // Check if it's a unique constraint error
        if (error.name === 'SequelizeUniqueConstraintError') {
          res.status(400).json({
            success: false,
            message: 'Already scanned',  // Custom message for duplicate entry
          });
        } else {
          res.status(500).json({
            success: false,
            message: 'Internal server error',  // General error message for other errors
          });
        }
      }
  }

  // Method to update an existing ItemCountScan (update current_branch)
  async updateItemCountScan(req, res) {
    try {
      const { item_count_scan_id, current_branch } = req.body;
  
      // Ensure the ItemCountScan exists
      const itemCountScan = await ItemCountScan.findByPk(item_count_scan_id);
      if (!itemCountScan) {
        return res.status(404).json({
          success: false,
          message: 'Item count scan not found',
        });
      }

      // Update the current_branch column
      itemCountScan.current_branch = current_branch;
      
      // Save the updated ItemCountScan
      await itemCountScan.save();
  
      res.status(200).json({
        success: true,
        message: 'Item count scan updated successfully',
        itemCountScanUpdated: itemCountScan,
      });
    } catch (error) {
      console.error('Error updating item count scan:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Method to get all ItemCountScans
  async getAllItemCountScans(req, res) {
    try {
      const itemCountScans = await ItemCountScan.findAll({
        include: [
          {
            model: Category,
            attributes: ['cat_id', 'cat_name'], // Adjust attributes as needed
          },
          {
            model: Item,
            attributes: ['item_code', 'name'], // Adjust attributes as needed
          },
        ],
      });

      res.status(200).json({
        success: true,
        message: 'Item count scans retrieved successfully',
        itemCountScans: itemCountScans,
      });
    } catch (error) {
      console.error('Error retrieving item count scans:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Method to get ItemCountScans based on filters
  async getItemCountScansByFilter(req, res) {
    try {
      const { branch, category_id, scanned_date } = req.query;

      // Convert scanned_date to Date object and set time to 00:00:00
      const date = new Date(scanned_date);
      date.setHours(0, 0, 0, 0);  // Set time to midnight
  
      // Find item count scans based on the provided filters
      const itemCountScans = await ItemCountScan.findAll({
        where: {
          branch: branch,
          category_id: category_id,
          scanned_date: date,
        },
        include: [
          {
            model: Category,
            attributes: ['cat_id', 'cat_name'], // Adjust attributes as needed
          },
          {
            model: Item,
            attributes: ['item_code', 'name'], // Adjust attributes as needed
          },
        ],
      });

      res.status(200).json({
        success: true,
        message: 'Item count scans retrieved successfully',
        itemCountScans: itemCountScans,
      });
    } catch (error) {
      console.error('Error retrieving item count scans by filter:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Method to get ItemCountScans based on filters additional current branch
  async getItemCountScansByFilterCurrentBranch(req, res) {
    try {
      const { branch, category_id, scanned_date,current_branch } = req.query;

      // Convert scanned_date to Date object and set time to 00:00:00
      const date = new Date(scanned_date);
      date.setHours(0, 0, 0, 0);  // Set time to midnight
  
      // Find item count scans based on the provided filters
      const itemCountScans = await ItemCountScan.findAll({
        where: {
          branch: branch,
          category_id: category_id,
          scanned_date: date,
          current_branch:current_branch,
        },
        include: [
          {
            model: Category,
            attributes: ['cat_id', 'cat_name'], // Adjust attributes as needed
          },
          {
            model: Item,
            attributes: ['item_code', 'name'], // Adjust attributes as needed
          },
        ],
      });

      res.status(200).json({
        success: true,
        message: 'Item count scans retrieved successfully',
        itemCountScans: itemCountScans,
      });
    } catch (error) {
      console.error('Error retrieving item count scans by filter:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async getItemCountsBySerialOrItemCode(req, res) {
    try {
      const { serial_no, item_code } = req.query;
  
      // Validate input
      if (!serial_no && !item_code) {
        return res.status(400).json({
          success: false,
          message: 'Please provide either serial_no or item_code',
        });
      }
  
      // Find items based on serial_no or item_code
      const itemCounts = await ItemCountScan.findAll({
        where: {
          [Op.or]: [
            serial_no ? { serial_no: serial_no } : null,
            item_code ? { item_id: item_code } : null,
          ].filter(Boolean),
        },
        include: [
          {
            model: Category,
            attributes: ['cat_id', 'cat_name'], // Adjust attributes as needed
          },
          {
            model: Item,
            attributes: ['item_code', 'name', 'serial_no'], // Adjust attributes as needed
          },
        ],
      });
  
      res.status(200).json({
        success: true,
        message: 'Item counts retrieved successfully',
        itemCounts: itemCounts,
      });
    } catch (error) {
      console.error('Error retrieving item counts by serial_no or item_code:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
}

module.exports = new ItemCountScanController();
