const POMachineRenewal = require("../model/po_machine_renewal.js");

class POMachineRenewalController {
  // Create PO Machine Renewal
  async createPOMachineRenewal(req, res) {
    try {
      const data = req.body;
      const { po_id, rent_item_id, from_date, to_date } = data;

      // Prevent duplicate entry for the same PO, item, and date range
      const exists = await POMachineRenewal.findOne({
        where: { po_id, rent_item_id, from_date, to_date },
      });

      if (exists) {
        return res.status(400).json({
          success: false,
          message: "This machine has already been renewed for the given period under the same PO.",
        });
      }

      const newRenewal = await POMachineRenewal.create(data);

      res.status(201).json({
        success: true,
        message: "PO Machine Renewal created successfully",
        poMachineRenewal: newRenewal,
      });
    } catch (error) {
      console.error("Error creating PO Machine Renewal:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  // Get all PO Machine Renewals
  async getAllPOMachineRenewals(req, res) {
    try {
      const records = await POMachineRenewal.findAll();

      res.status(200).json({
        success: true,
        message: "PO Machine Renewals retrieved successfully",
        poMachineRenewals: records,
      });
    } catch (error) {
      console.error("Error retrieving PO Machine Renewals:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  // Get PO Machine Renewal by ID
  async getPOMachineRenewalById(req, res) {
    try {
      const { id } = req.params;

      const record = await POMachineRenewal.findByPk(id);

      if (!record) {
        return res.status(404).json({
          success: false,
          message: "PO Machine Renewal not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "PO Machine Renewal retrieved successfully",
        poMachineRenewal: record,
      });
    } catch (error) {
      console.error("Error retrieving PO Machine Renewal:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  // Update PO Machine Renewal
  async updatePOMachineRenewal(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const record = await POMachineRenewal.findByPk(id);

      if (!record) {
        return res.status(404).json({
          success: false,
          message: "PO Machine Renewal not found",
        });
      }

      await record.update(updates);

      res.status(200).json({
        success: true,
        message: "PO Machine Renewal updated successfully",
        poMachineRenewal: record,
      });
    } catch (error) {
      console.error("Error updating PO Machine Renewal:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  // Delete PO Machine Renewal
  async deletePOMachineRenewal(req, res) {
    try {
      const { id } = req.params;

      const record = await POMachineRenewal.findByPk(id);

      if (!record) {
        return res.status(404).json({
          success: false,
          message: "PO Machine Renewal not found",
        });
      }

      await record.destroy();

      res.status(200).json({
        success: true,
        message: "PO Machine Renewal deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting PO Machine Renewal:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
}

module.exports = new POMachineRenewalController();
