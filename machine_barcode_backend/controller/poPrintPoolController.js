// controllers/POPrintPoolController.js
const POPrintPool = require("../model/po_print_pool");
const PurchaseOrder = require("../model/purchaseorder");
const Employee = require("../model/employee");

class POPrintPoolController {
  // Create new record
  static async createPoPrintPool(req, res) {
    try {
      const { po_id, printed_by } = req.body;

      const newRecord = await POPrintPool.create({
        po_id,
        printed_by,
        first_print: true,
        print_count: 1,
        last_print_date: new Date(),
      });

      res.status(201).json({
        success: true,
        message: "PO Print Pool entry created successfully",
        data: newRecord,
      });
    } catch (err) {
      console.error("Error creating POPrintPool:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  // Get all records with associations
  // Get all
  static async getAllPoPrintPools(req, res) {
    try {
      const records = await POPrintPool.findAll({
        include: [
          { model: PurchaseOrder }, // Full PO model
          { model: Employee }, // Full Employee model
        ],
      });

      res.status(200).json({
        success: true,
        data: records,
      });
    } catch (err) {
      console.error("Error fetching POPrintPool records:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  // Get by PO ID
  static async getByPOId(req, res) {
    try {
      const { po_id } = req.params;

      const record = await POPrintPool.findOne({
        where: { po_id },
        include: [
          { model: PurchaseOrder }, // Full PO model
          { model: Employee }, // Full Employee model
        ],
      });

      if (!record) {
        return res
          .status(404)
          .json({ success: false, message: "Record not found" });
      }

      res.status(200).json({
        success: true,
        data: record,
      });
    } catch (err) {
      console.error("Error fetching POPrintPool by PO ID:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  // Update by PO ID (last_print_date + printed_by)
  static async updateByPOId(req, res) {
    try {
      const { po_id } = req.params;
      const { printed_by } = req.body;

      const record = await POPrintPool.findOne({ where: { po_id } });
      if (!record) {
        return res
          .status(404)
          .json({ success: false, message: "Record not found" });
      }

      record.print_count += 1;
      record.last_print_date = new Date();
      record.printed_by = printed_by;
      record.first_print = false;

      await record.save();

      res.status(200).json({
        success: true,
        message: "Record updated successfully",
        data: record,
      });
    } catch (err) {
      console.error("Error updating POPrintPool:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
}

module.exports = POPrintPoolController;
