const ItemTransfer = require("../model/item_transfer"); // Adjust path as needed
const Item = require("../model/item"); // Adjust path as needed
const Employee = require("../model/employee");
const { Op } = require("sequelize");
const moment = require("moment"); // Import moment.js for date formatting

class ItemTransferController {
  // Get all item transfers
  static async getAllTransfers(req, res) {
    try {
      const transfers = await ItemTransfer.findAll({
        include: {
          model: Item, // Include the associated Item details
          attributes: ["item_code", "serial_no","name", "description", "branch"], // Customize included fields as needed
        },
      });
      return res.status(200).json({
        success: true,
        message: "Item transfers retrieved successfully",
        data: transfers,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve item transfers",
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
          attributes: ["item_code", "name", "description", "branch"],
        },
      });

      if (!transfer) {
        return res.status(404).json({
          success: false,
          message: "Item transfer not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Item transfer retrieved successfully",
        data: transfer,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve item transfer",
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
          attributes: ["item_code", "name", "description", "branch"],
        },
      });

      if (!transfers.length) {
        return res.status(404).json({
          success: false,
          message: "No item transfers found with the specified status",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Item transfers retrieved successfully",
        data: transfers,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve item transfers",
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
          [Op.or]: [{ owner_branch: branch }, { sending_branch: branch }],
        },
        include: {
          model: Item,
          attributes: ["item_code", "name", "description", "branch"],
        },
      });

      if (!transfers.length) {
        return res.status(404).json({
          success: false,
          message: "No item transfers found for the specified branch",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Item transfers retrieved successfully",
        data: transfers,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve item transfers",
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
      if (
        !item_id ||
        !owner_branch ||
        !sending_branch ||
        !employee_id ||
        !status
      ) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
      }

      // Check if the item exists
      const item = await Item.findOne({ where: { item_code: item_id } });
      if (!item) {
        return res.status(404).json({
          success: false,
          message: "Item not found",
        });
      }

      // Check if the employee exists
      const employee = await Employee.findOne({ where: { employee_id } });
      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }

      // Check for existing records with the same item_id
      const existingTransfer = await ItemTransfer.findOne({
        where: { item_id },
        order: [["createdAt", "DESC"]], // Get the most recent transfer for the item
      });

      if (existingTransfer) {
        if (existingTransfer.status === "Pending") {
          return res.status(400).json({
            success: false,
            message:
              "Cannot create a new transfer record for this item because the current transfer is still Pending.",
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

      return res.status(200).json({
        success: true,
        message: "Item transfer created successfully",
        data: newTransfer,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to create item transfer",
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
            [Op.or]: [{ owner_branch: branch }, { sending_branch: branch }],
          }
        : {}; // No filter if branch is not provided

      // Fetch item transfers with their respective items
      const transfers = await ItemTransfer.findAll({
        where: whereCondition,
        include: {
          model: Item,
          attributes: ["item_code", "name", "description", "branch"], // Select item fields
        },
      });

      // Check if transfers exist
      if (!transfers.length) {
        return res.status(404).json({
          success: false,
          message: branch
            ? `No item transfers found for branch: ${branch}`
            : "No item transfers found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Item transfers retrieved successfully",
        data: transfers,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve item transfers",
        error: error.message,
      });
    }
  }

  static async getTransfersByPrevUsedBranch(req, res) {
    try {
      const { prevUsedBranch } = req.query; // Get prev_used_branch from query params

      // Ensure the prevUsedBranch is provided
      if (!prevUsedBranch) {
        return res.status(400).json({
          success: false,
          message: "Previous used branch is required",
        });
      }

      // Fetch item transfers where prev_used_branch matches the input
      const transfers = await ItemTransfer.findAll({
        where: {
          prev_used_branch: prevUsedBranch, // Filter by previous used branch
        },
        include: {
          model: Item,
          attributes: ["item_code", "name", "description", "branch"], // Select item fields
        },
        order: [["createdAt", "DESC"]], // Order by createdAt in descending order
      });

      // Check if transfers exist
      if (!transfers.length) {
        return res.status(404).json({
          success: false,
          message: `No item transfers found for previous used branch: ${prevUsedBranch}`,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Item transfers retrieved successfully",
        data: transfers,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve item transfers",
        error: error.message,
      });
    }
  }

  static async updateItemTransferStatus(req, res) {
    try {
      const { item_code, accept_by } = req.body; // Get item_code and accept_by from request body

      // Validate input
      if (!item_code || !accept_by) {
        return res.status(400).json({
          success: false,
          message: "Item code and accept_by are required",
        });
      }

      // Find the latest item transfer with status 'Pending' for the given item_code
      const transfer = await ItemTransfer.findOne({
        where: {
          status: "Pending",
        },
        include: {
          model: Item,
          where: { item_code }, // Ensure the item_code matches
          attributes: ["item_code"],
        },
        order: [["createdAt", "DESC"]], // Get the most recent record
      });

      if (!transfer) {
        return res.status(404).json({
          success: false,
          message: "No pending transfer found for the given item code",
        });
      }

      // Update the transfer status to 'Completed'
      transfer.status = "Accepted";
      transfer.accept_by = accept_by;
      transfer.arrived_date = moment().format("YYYY-MM-DD HH:mm:ss"); // Set arrived_date to today's date

      await transfer.save();

      return res.status(200).json({
        success: true,
        message: "Item transfer updated successfully",
        data: transfer,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to update item transfer status",
        error: error.message,
      });
    }
  }

  // Get transfer details by item code and status 'Pending'
  static async getTransferDetailsByItemCode(req, res) {
    try {
      const { item_code } = req.query; // Get item_code from query params

      if (!item_code) {
        return res.status(400).json({
          success: false,
          message: "Item code is required",
        });
      }

      // Fetch the transfer with the given item_code and status 'Pending'
      const transfer = await ItemTransfer.findOne({
        where: {
          item_id: item_code,
          status: "Pending", // Ensure only pending transfers are returned
        },
        include: {
          model: Item,
          attributes: ["item_code", "name", "description", "branch"], // Include item fields
        },
      });

      if (!transfer) {
        return res.status(404).json({
          success: false,
          message: `No pending transfer found for item code: ${item_code}`,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Item transfer details retrieved successfully",
        data: transfer,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve item transfer details",
        error: error.message,
      });
    }
  }

  static async getPendingTransfersByBranch(req, res) {
    try {
      const { branch } = req.query; // Get branch from query params

      if (!branch) {
        return res.status(400).json({
          success: false,
          message: "Branch is required",
        });
      }

      // Fetch all pending transfers where sending_branch matches the given branch
      const transfers = await ItemTransfer.findAll({
        where: {
          sending_branch: branch,
          status: "Pending", // Filter only pending transfers
        },
        include: {
          model: Item,
          attributes: ["item_code", "name", "description", "branch"], // Include item fields
        },
        order: [["createdAt", "DESC"]], // Sort by most recent first
      });

      if (!transfers.length) {
        return res.status(404).json({
          success: false,
          message: `No pending item transfers found for branch: ${branch}`,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Pending item transfers retrieved successfully",
        data: transfers,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve pending item transfers",
        error: error.message,
      });
    }
  }

  // Get latest sending branch by item code
  //get latest record by item code from sending branch
  static async getSendingBranchByItemCode(req, res) {
    try {
      const { item_code } = req.query;

      if (!item_code) {
        return res.status(400).json({
          success: false,
          message: "Item code is required",
        });
      }

      const itemTransfer = await ItemTransfer.findOne({
        where: {
          status: "Accepted",
        },
        include: [
          {
            model: Item,
            where: {
              item_code: item_code,
            },
          },
        ],
        order: [["arrived_date", "DESC"]],
      });

      if (!itemTransfer) {
        const item = await Item.findOne({
          where: {
            item_code: item_code,
          },
        });

        return res.status(200).json({
          success: true,
          message:
            "Item not found in transfers, returning item's original branch",
          data: {
            new_branch: item ? item.branch : null,
          },
        });
      }

      return res.status(200).json({
        success: true,
        message: "Item found",
        data: {
          new_branch: itemTransfer.sending_branch,
        },
      });
    } catch (error) {
      console.error("Error in getSendingBranchByItemCode:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }

  //method to get the machine transfers to web
  // Get item transfers filtered by sending and previous branch
  static async getItemTransfersBySendingAndPreviousBranch(req, res) {
    try {
      const { sending_branch, prev_used_branch } = req.query;

      // Ensure at least one filter is provided
      if (!sending_branch && !prev_used_branch) {
        return res.status(400).json({
          success: false,
          message:
            "At least one of 'sending_branch' or 'prev_used_branch' must be provided",
        });
      }

      // Build dynamic where condition
      const whereCondition = {};
      if (sending_branch) {
        whereCondition.sending_branch = sending_branch;
      }
      if (prev_used_branch) {
        whereCondition.prev_used_branch = prev_used_branch;
      }

      const transfers = await ItemTransfer.findAll({
        where: whereCondition,
        include: {
          model: Item,
          attributes: ["item_code","serial_no","name", "description", "branch"],
        },
      });

      if (!transfers.length) {
        return res.status(404).json({
          success: false,
          message: `No item transfers found${
            sending_branch ? ` for sending_branch: ${sending_branch}` : ""
          }${
            prev_used_branch ? ` and prev_used_branch: ${prev_used_branch}` : ""
          }`,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Item transfers retrieved successfully",
        data: transfers,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve item transfers",
        error: error.message,
      });
    }
  }
}

module.exports = ItemTransferController;
