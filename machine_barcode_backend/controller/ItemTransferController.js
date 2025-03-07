const ItemTransfer = require('../model/item_transfer'); // Adjust path as needed
const Item = require('../model/item'); // Adjust path as needed
const Employee = require('../model/employee');
const { Op } = require('sequelize');

class ItemTransferController {
  // Get all item transfers
  static async getAllTransfers(req, res) {
    try {
      const transfers = await ItemTransfer.findAll({
        include: {
          model: Item, // Include the associated Item details
          attributes: ['item_code', 'name', 'description', 'branch'], // Customize included fields as needed
        },
      });
      return res.status(200).json({
        success: true,
        message: 'Item transfers retrieved successfully',
        data: transfers,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve item transfers',
        error: error.message,
      });
    }
  }

  // Get a single item transfer by ID
  static async getTransferById(req, res) {
    try {
      const { id } = req.params;
      const transfer = await ItemTransfer.findOne({
        where: { item_transfer_id: id },
        include: {
          model: Item,
          attributes: ['item_code', 'name', 'description', 'branch'],
        },
      });

      if (!transfer) {
        return res.status(404).json({
          success: false,
          message: 'Item transfer not found',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Item transfer retrieved successfully',
        data: transfer,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve item transfer',
        error: error.message,
      });
    }
  }

  // Get transfers by status
  static async getTransfersByStatus(req, res) {
    try {
      const { status } = req.query;
      const transfers = await ItemTransfer.findAll({
        where: { status },
        include: {
          model: Item,
          attributes: ['item_code', 'name', 'description', 'branch'],
        },
      });

      if (!transfers.length) {
        return res.status(404).json({
          success: false,
          message: 'No item transfers found with the specified status',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Item transfers retrieved successfully',
        data: transfers,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve item transfers',
        error: error.message,
      });
    }
  }

  // Get transfers by branch
  static async getTransfersByBranch(req, res) {
    try {
      const { branch } = req.query;
      const transfers = await ItemTransfer.findAll({
        where: {
          [Op.or]: [
            { owner_branch: branch },
            { sending_branch: branch },
          ],
        },
        include: {
          model: Item,
          attributes: ['item_code', 'name', 'description', 'branch'],
        },
      });

      if (!transfers.length) {
        return res.status(404).json({
          success: false,
          message: 'No item transfers found for the specified branch',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Item transfers retrieved successfully',
        data: transfers,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve item transfers',
        error: error.message,
      });
    }
  }

  static async createItemTransfer(req, res) {
    try {
      const {
        item_id,
        owner_branch,
        prev_used_branch,
        sending_branch,
        employee_id,
        status,
        accept_by,
        arrived_date,
      } = req.body;
  
      // Validate required fields
      if (!item_id || !owner_branch || !sending_branch || !employee_id || !status) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields',
        });
      }
  
      // Check if the item exists
      const item = await Item.findOne({ where: { item_code: item_id } });
      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Item not found',
        });
      }
  
      // Check if the employee exists
      const employee = await Employee.findOne({ where: { employee_id } });
      if (!employee) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found',
        });
      }
  
      // Check for existing records with the same item_id
      const existingTransfer = await ItemTransfer.findOne({
        where: { item_id },
        order: [['createdAt', 'DESC']], // Get the most recent transfer for the item
      });
  
      if (existingTransfer) {
        if (existingTransfer.status === 'Pending') {
          return res.status(400).json({
            success: false,
            message: 'Cannot create a new transfer record for this item because the current transfer is still Pending.',
          });
        }
      }
  
      // Create the item transfer
      const newTransfer = await ItemTransfer.create({
        item_id,
        owner_branch,
        prev_used_branch: prev_used_branch || null, // Optional field
        sending_branch,
        employee_id,
        status,
        accept_by: accept_by || null, // Optional field
        arrived_date: arrived_date || null, // Optional field
      });
  
      return res.status(201).json({
        success: true,
        message: 'Item transfer created successfully',
        data: newTransfer,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create item transfer',
        error: error.message,
      });
    }
  }
  


  // Get all item transfers with their respective items
  static async getAllItemTransfersByBranch(req, res) {
    try {
      const { branch } = req.query; // Optional branch filter

      // Build query conditions
      const whereCondition = branch
        ? {
            [Op.or]: [
              { owner_branch: branch },
              { sending_branch: branch },
            ],
          }
        : {}; // No filter if branch is not provided

      // Fetch item transfers with their respective items
      const transfers = await ItemTransfer.findAll({
        where: whereCondition,
        include: {
          model: Item,
          attributes: ['item_code', 'name', 'description', 'branch'], // Select item fields
        },
      });

      // Check if transfers exist
      if (!transfers.length) {
        return res.status(404).json({
          success: false,
          message: branch
            ? `No item transfers found for branch: ${branch}`
            : 'No item transfers found',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Item transfers retrieved successfully',
        data: transfers,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve item transfers',
        error: error.message,
      });
    }
  }
}

module.exports = ItemTransferController;
