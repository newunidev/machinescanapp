const Category = require('../model/category');
const Item = require('../model/item');
const IdleScan = require('../model/idle_scan'); // Assuming you have an IdleScan model
const { Sequelize } = require('sequelize');

class IdleScanController {
  // Method to create a new IdleScan
  async createIdleScan(req, res) {
    try {
      const { category_id, item_id, scanned_date, branch, current_branch } = req.body;
  
      // Ensure the category exists
      const category = await Category.findByPk(category_id);
      if (!category) {
        return res.status(400).json({ success: false, message: 'Category not found' });
      }
  
      // Ensure the item exists
      const item = await Item.findByPk(item_id);
      if (!item) {
        return res.status(400).json({ success: false, message: 'Item not found' });
      }
  
      // Convert scanned_date to Date object and set time to 00:00:00
      const scannedDate = new Date(scanned_date);
      scannedDate.setHours(0, 0, 0, 0);
  
      // Create the new idle scan
      const newIdleScan = await IdleScan.create({ category_id, item_id, scanned_date: scannedDate, branch, current_branch });
  
      res.status(200).json({ success: true, message: 'Idle scan created successfully', idleScanCreated: newIdleScan });
    } catch (error) {
      console.error('Error creating idle scan:', error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({ success: false, message: 'Already scanned' });
      } else {
        res.status(500).json({ success: false, message: 'Internal server error' });
      }
    }
  }

  // Method to update an existing IdleScan (update current_branch)
  async updateIdleScan(req, res) {
    try {
      const { idleScan_id, current_branch } = req.body;
  
      const idleScan = await IdleScan.findByPk(idleScan_id);
      if (!idleScan) {
        return res.status(404).json({ success: false, message: 'Idle scan not found' });
      }
  
      idleScan.current_branch = current_branch;
      await idleScan.save();
  
      res.status(200).json({ success: true, message: 'Idle scan updated successfully', idleScanUpdated: idleScan });
    } catch (error) {
      console.error('Error updating idle scan:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  // Method to get all IdleScans
  async getAllIdleScans(req, res) {
    try {
      const idleScans = await IdleScan.findAll({
        include: [
          { model: Category, attributes: ['cat_id', 'cat_name'] },
          { model: Item, attributes: ['item_code', 'name'] },
        ],
      });
  
      res.status(200).json({ success: true, message: 'Idle scans retrieved successfully', idleScans });
    } catch (error) {
      console.error('Error retrieving idle scans:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  // Method to get IdleScans based on filters
  async getIdleScansByFilter(req, res) {
    try {
      const { branch, category_id, scanned_date } = req.query;
      const date = new Date(scanned_date);
      date.setHours(0, 0, 0, 0);
  
      const idleScans = await IdleScan.findAll({
        where: { branch, category_id, scanned_date: date },
        include: [
          { model: Category, attributes: ['cat_id', 'cat_name'] },
          { model: Item, attributes: ['item_code', 'name'] },
        ],
      });
  
      res.status(200).json({ success: true, message: 'Idle scans retrieved successfully', idleScans });
    } catch (error) {
      console.error('Error retrieving idle scans by filter:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  // Method to get IdleScans based on filters including current branch
  async getIdleScansByFilterCurrentBranch(req, res) {
    try {
      const { branch, category_id, scanned_date, current_branch } = req.query;
      const date = new Date(scanned_date);
      date.setHours(0, 0, 0, 0);
  
      const idleScans = await IdleScan.findAll({
        where: { branch, category_id, scanned_date: date, current_branch },
        include: [
          { model: Category, attributes: ['cat_id', 'cat_name'] },
          { model: Item, attributes: ['item_code', 'name'] },
        ],
      });
  
      res.status(200).json({ success: true, message: 'Idle scans retrieved successfully', idleScans });
    } catch (error) {
      console.error('Error retrieving idle scans by filter:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  
  // Method to get IdleScans count by category
  async getIdleScanCountByCategory(req, res) {
    try {
      const idleScanCounts = await IdleScan.findAll({
        attributes: [
          'category_id',
          [Sequelize.fn('COUNT', Sequelize.col('category_id')), 'count'],
        ],
        include: [
          { model: Category, attributes: ['cat_id', 'cat_name'] },
        ],
        group: ['category_id', 'Category.cat_id', 'Category.cat_name'],
      });

      res.status(200).json({
        success: true,
        message: 'Idle scan counts by category retrieved successfully',
        idleScanCounts,
      });
    } catch (error) {
      console.error('Error retrieving idle scan counts:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  // Method to get IdleScans count by category, filtered by branch and scanned_date
  async getIdleScanCountByCategoryBranchDate(req, res) {
    
    try {
      const { current_branch, scanned_date } = req.query;
      console.log(current_branch,scanned_date);

      // Convert scanned_date to a Date object and normalize time
      const date = new Date(scanned_date);
      date.setHours(0, 0, 0, 0);

      const idleScanCounts = await IdleScan.findAll({
        attributes: [
          'category_id',
          [Sequelize.fn('COUNT', Sequelize.col('category_id')), 'count'],
        ],
        where: { current_branch, scanned_date: date },
        include: [{ model: Category, attributes: ['cat_id', 'cat_name'] }],
        group: ['category_id', 'Category.cat_id', 'Category.cat_name'],
      });

      res.status(200).json({
        success: true,
        message: 'Idle scan counts by category retrieved successfully',
        idleScanCounts,
      });
    } catch (error) {
      console.error('Error retrieving idle scan counts:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }



  //method to get idleScans with category id, date,current_branch
  
  async getIdleScansByFilterCurrentBranchOnly(req, res) {
    try {
      const { category_id, scanned_date, current_branch } = req.query;
      const date = new Date(scanned_date);
      date.setHours(0, 0, 0, 0);
  
      const idleScans = await IdleScan.findAll({
        where: { category_id, scanned_date: date, current_branch },
        include: [
          { model: Category, attributes: ['cat_id', 'cat_name'] },
          { 
            model: Item, 
            attributes: ['item_code', 'name', 'description', 'serial_no', 'branch'] 
          },
        ],
      });
  
      res.status(200).json({ success: true, message: 'Idle scans retrieved successfully', idleScans });
    } catch (error) {
      console.error('Error retrieving idle scans by filter:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
  


}

module.exports = new IdleScanController();
