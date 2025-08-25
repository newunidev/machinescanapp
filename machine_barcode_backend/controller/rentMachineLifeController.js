const RentMachineLife = require("../model/rent_machine_life.js");
const RentMachine = require("../model/rent_machine.js");
const PurchaseOrder = require("../model/purchaseorder.js");
const CategoryPurchaseOrder = require("../model/category_purchaseorder.js");
const GRN = require("../model/grn.js");
const { Op } = require("sequelize");

const RentMachineLifeController = {
  // Create new rent machine life record
  async create(req, res) {
    try {
      const {
        po_id,
        cpo_id,
        grn_id,
        branch,
        rent_item_id,
        from_date,
        to_date,
      } = req.body;

      // Validate required fields
      if (
        !po_id ||
        !cpo_id ||
        !branch ||
        !rent_item_id ||
        !from_date ||
        !to_date
      ) {
        return res
          .status(400)
          .json({ success: false, message: "Missing required fields" });
      }

      // Validate Purchase Order exists
      const purchaseOrder = await PurchaseOrder.findByPk(po_id);
      if (!purchaseOrder) {
        return res
          .status(404)
          .json({
            success: false,
            message: `Purchase Order ${po_id} not found`,
          });
      }

      // Validate Category Purchase Order exists
      const categoryPO = await CategoryPurchaseOrder.findByPk(cpo_id);
      if (!categoryPO) {
        return res
          .status(404)
          .json({
            success: false,
            message: `Category Purchase Order ${cpo_id} not found`,
          });
      }

      // Validate Rent Machine exists
      const rentMachine = await RentMachine.findByPk(rent_item_id);
      if (!rentMachine) {
        return res
          .status(404)
          .json({
            success: false,
            message: `Rent Machine ${rent_item_id} not found`,
          });
      }

      // Validate GRN if provided
      if (grn_id) {
        const grn = await GRN.findByPk(grn_id);
        if (!grn) {
          return res
            .status(404)
            .json({ success: false, message: `GRN ${grn_id} not found` });
        }
      }

      // Create record
      const newRecord = await RentMachineLife.create({
        po_id,
        cpo_id,
        grn_id,
        branch,
        rent_item_id,
        from_date,
        to_date,
      });

      res.status(201).json({
        success: true,
        message: "Rent machine life record created successfully",
        data: newRecord,
      });
    } catch (error) {
      console.error("Error creating rent machine life:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },

  // Get all records
  async getAll(req, res) {
    try {
      const records = await RentMachineLife.findAll({
        include: [
          { model: RentMachine },
          { model: PurchaseOrder },
          { model: CategoryPurchaseOrder },
          { model: GRN },
        ],
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json({ success: true, data: records });
    } catch (error) {
      console.error("Error fetching records:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },

  // Get by ID
  async getById(req, res) {
    try {
      const { id } = req.params;

      const record = await RentMachineLife.findByPk(id, {
        include: [
          { model: RentMachine },
          { model: PurchaseOrder },
          { model: CategoryPurchaseOrder },
          { model: GRN },
        ],
      });

      if (!record) {
        return res
          .status(404)
          .json({ success: false, message: "Record not found" });
      }

      res.status(200).json({ success: true, data: record });
    } catch (error) {
      console.error("Error fetching record:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },

  // Update
  async update(req, res) {
    try {
      const { id } = req.params;
      const {
        po_id,
        cpo_id,
        grn_id,
        branch,
        rent_item_id,
        from_date,
        to_date,
      } = req.body;

      const record = await RentMachineLife.findByPk(id);
      if (!record) {
        return res
          .status(404)
          .json({ success: false, message: "Record not found" });
      }

      await record.update({
        po_id,
        cpo_id,
        grn_id,
        branch,
        rent_item_id,
        from_date,
        to_date,
      });

      res
        .status(200)
        .json({
          success: true,
          message: "Record updated successfully",
          data: record,
        });
    } catch (error) {
      console.error("Error updating record:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },

  // Delete
  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await RentMachineLife.destroy({ where: { id } });

      if (!deleted) {
        return res
          .status(404)
          .json({ success: false, message: "Record not found" });
      }

      res
        .status(200)
        .json({ success: true, message: "Record deleted successfully" });
    } catch (error) {
      console.error("Error deleting record:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },

  async getExpiredMachines(req, res) {
    try {
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

      const expiredMachines = await RentMachineLife.findAll({
        where: {
          to_date: { [Op.lt]: today }, // Expired
        },
        include: [
          {
            model: RentMachine,
            where: {
              machine_status: { [Op.ne]: "Returned" }, // Not returned
            },
          },
          { model: PurchaseOrder, attributes: ["POID", "branch"] },
          { model: CategoryPurchaseOrder, attributes: ["cpo_id", "cat_id"] },
          { model: GRN, attributes: ["grn_id", "grn_date"] },
        ],
        order: [["to_date", "ASC"]],
      });

      res.status(200).json({
        success: true,
        message: "Expired machines retrieved successfully",
        data: expiredMachines,
      });
    } catch (error) {
      console.error("Error fetching expired machines:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
};

module.exports = RentMachineLifeController;
