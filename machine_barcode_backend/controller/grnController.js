const GRN = require("../model/grn.js");
const PurchaseOrder = require("../model/purchaseorder.js");
const Employee = require("../model/employee.js");
const { Op } = require("sequelize");
const CategoryPurchaseOrder = require("../model/category_purchaseorder.js");
const GRN_RentMachine = require("../model/grn_rent_machine.js");
const RentMachine = require("../model/rent_machine.js");
const Category = require("../model/category.js");
const Supplier = require("../model/supplier.js");

class GRNController {
  // Create GRN
  async createGRN(req, res) {
    try {
      const data = req.body;

      // Optional: Validation logic can be added here

      const newGRN = await GRN.create(data);

      res.status(201).json({
        success: true,
        message: "GRN created successfully",
        grn: newGRN,
      });
    } catch (error) {
      console.error("Error creating GRN:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  // Get all GRNs
  async getAllGRNs(req, res) {
    try {
      const grns = await GRN.findAll({
        include: [
          {
            model: PurchaseOrder,
          },
          {
            model: Employee,
          },
        ],
      });

      res.status(200).json({
        success: true,
        message: "GRNs retrieved successfully",
        grns,
      });
    } catch (error) {
      console.error("Error retrieving GRNs:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  // Get GRN by Purchase Order ID
  async getGRNByPOId(req, res) {
    try {
      const { po_id } = req.query;

      const grn = await GRN.findOne({
        where: { po_id },
        include: [
          {
            model: PurchaseOrder,
          },
          {
            model: Employee,
          },
        ],
      });

      if (!grn) {
        return res.status(404).json({
          success: false,
          message: "GRN not found for the given Purchase Order ID",
        });
      }

      res.status(200).json({
        success: true,
        message: "GRN retrieved successfully",
        grn,
      });
    } catch (error) {
      console.error("Error retrieving GRN by PO ID:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  // Update GRN by Purchase Order ID
  async updateGRNByPOId(req, res) {
    try {
      const { po_id } = req.query;
      const updatedData = req.body;

      const grn = await GRN.findOne({ where: { po_id } });

      if (!grn) {
        return res.status(404).json({
          success: false,
          message: "GRN not found for the given Purchase Order ID",
        });
      }

      await grn.update(updatedData);

      res.status(200).json({
        success: true,
        message: "GRN updated successfully",
        grn,
      });
    } catch (error) {
      console.error("Error updating GRN:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  // Delete GRN by ID
  async deleteGRN(req, res) {
    try {
      const { id } = req.query;

      const grn = await GRN.findByPk(id);

      if (!grn) {
        return res.status(404).json({
          success: false,
          message: "GRN not found",
        });
      }

      await grn.destroy();

      res.status(200).json({
        success: true,
        message: "GRN deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting GRN:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
  // In GRNController class
  async getGRNWithRentMachinesByPOId(req, res) {
    try {
      const { po_id } = req.query;

      if (!po_id) {
        return res.status(400).json({
          success: false,
          message: "po_id query parameter is required",
        });
      }

      const grns = await GRN.findAll({
        where: { po_id },
        include: [
          {
            model: GRN_RentMachine, // make sure GRN_RentMachine is imported here
            include: [
              {
                model: RentMachine, // to get full RentMachine details
                include: [
                  { model: Category, attributes: ["cat_id", "cat_name"] },
                  { model: Supplier, attributes: ["supplier_id", "name"] },
                ],
              },
              {
                model: CategoryPurchaseOrder, // if needed
              },
            ],
          },
          {
            model: PurchaseOrder,
          },
          {
            model: Employee,
          },
        ],
      });

      if (!grns || grns.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No GRN records found for the given PO ID",
        });
      }

      res.status(200).json({
        success: true,
        message: "GRNs with Rent Machines retrieved successfully",
        grns,
      });
    } catch (error) {
      console.error("Error fetching GRNs with Rent Machines by PO ID:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}

module.exports = new GRNController();
