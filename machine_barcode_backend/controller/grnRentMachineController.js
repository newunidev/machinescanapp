const GRN_RentMachine = require("../model/grn_rent_machine");
const GRN = require("../model/grn");
const CategoryPurchaseOrder = require("../model/category_purchaseorder");
const RentMachine = require("../model/rent_machine");

class GRNRentMachineController {
  // Create GRN Rent Machine record
  async createGRNRentMachine(req, res) {
    try {
      const data = req.body;

      const newRecord = await GRN_RentMachine.create(data);

      res.status(201).json({
        success: true,
        message: "GRN Rent Machine created successfully",
        grnRentMachine: newRecord,
      });
    } catch (error) {
      console.error("Error creating GRN Rent Machine:", error);

      // Handle duplicate entry error (unique constraint violation)
      if (
        error.name === "SequelizeUniqueConstraintError" ||
        (error.original && error.original.code === "ER_DUP_ENTRY")
      ) {
        return res.status(400).json({
          success: false,
          message:
            "A record with the same grn_id, cpo_id, and rent_item_id already exists.",
        });
      }

      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  // Get all GRN Rent Machine records
  async getAllGRNRentMachines(req, res) {
    try {
      const records = await GRN_RentMachine.findAll({
        include: [
          { model: GRN },
          { model: CategoryPurchaseOrder },
          { model: RentMachine },
        ],
      });

      res.status(200).json({
        success: true,
        message: "GRN Rent Machines retrieved successfully",
        grnRentMachines: records,
      });
    } catch (error) {
      console.error("Error retrieving GRN Rent Machines:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  // Get GRN Rent Machines by GRN ID
  async getGRNRentMachinesByGRNId(req, res) {
    try {
      const { grn_id } = req.query;

      const records = await GRN_RentMachine.findAll({
        where: { grn_id },
        include: [
          { model: GRN },
          { model: CategoryPurchaseOrder },
          { model: RentMachine },
        ],
      });

      if (!records.length) {
        return res.status(404).json({
          success: false,
          message: "No GRN Rent Machine records found for this GRN ID",
        });
      }

      res.status(200).json({
        success: true,
        message: "GRN Rent Machines retrieved successfully",
        grnRentMachines: records,
      });
    } catch (error) {
      console.error("Error retrieving GRN Rent Machines by GRN ID:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  // Update GRN Rent Machine by ID (g_rm_id)
  async updateGRNRentMachineById(req, res) {
    try {
      const { id } = req.params; // g_rm_id
      const updatedData = req.body;

      const record = await GRN_RentMachine.findByPk(id);
      if (!record) {
        return res.status(404).json({
          success: false,
          message: "GRN Rent Machine record not found",
        });
      }

      await record.update(updatedData);

      res.status(200).json({
        success: true,
        message: "GRN Rent Machine updated successfully",
        grnRentMachine: record,
      });
    } catch (error) {
      console.error("Error updating GRN Rent Machine:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  // Delete GRN Rent Machine by ID (g_rm_id)
  async deleteGRNRentMachineById(req, res) {
    try {
      const { id } = req.params;

      const record = await GRN_RentMachine.findByPk(id);
      if (!record) {
        return res.status(404).json({
          success: false,
          message: "GRN Rent Machine record not found",
        });
      }

      await record.destroy();

      res.status(200).json({
        success: true,
        message: "GRN Rent Machine deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting GRN Rent Machine:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}

module.exports = new GRNRentMachineController();
