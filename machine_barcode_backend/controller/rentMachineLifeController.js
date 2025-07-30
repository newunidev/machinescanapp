const RentMachineLife = require("../model/rent_machine_life.js");
const RentMachine = require("../model/rent_machine.js");

const RentMachineLifeController = {
  // Create new rent machine life record
  async create(req, res) {
    try {
      const { rent_item_id, from_date, to_date } = req.body;

      if (!rent_item_id || !from_date || !to_date) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
      }

      const newRecord = await RentMachineLife.create({
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
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  },

  // Get all records
  async getAll(req, res) {
    try {
      const records = await RentMachineLife.findAll({
        include: [{ model: RentMachine }],
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json({ success: true, data: records });
    } catch (error) {
      console.error("Error fetching records:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  },

  // Get by ID
  async getById(req, res) {
    try {
      const { id } = req.params;

      const record = await RentMachineLife.findByPk(id, {
        include: [{ model: RentMachine }],
      });

      if (!record) {
        return res.status(404).json({ success: false, message: "Record not found" });
      }

      res.status(200).json({ success: true, data: record });
    } catch (error) {
      console.error("Error fetching record:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  },

  // Delete
  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await RentMachineLife.destroy({ where: { id } });

      if (!deleted) {
        return res.status(404).json({ success: false, message: "Record not found" });
      }

      res.status(200).json({ success: true, message: "Record deleted successfully" });
    } catch (error) {
      console.error("Error deleting record:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  },
};

module.exports = RentMachineLifeController;
