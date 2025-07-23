const RentMachine = require("../model/rent_machine");
const Category = require("../model/category");
const Supplier = require("../model/supplier");
const { Op, fn, col } = require("sequelize");

class RentMachineController {
  // Create Rent Machine
  async createRentMachine(req, res) {
    try {
      const data = req.body;

      // Validate required foreign keys
      const category = await Category.findByPk(data.cat_id);
      if (!category) {
        return res
          .status(400)
          .json({ success: false, message: "Category not found" });
      }

      const supplier = await Supplier.findByPk(data.sup_id);
      if (!supplier) {
        return res
          .status(400)
          .json({ success: false, message: "Supplier not found" });
      }

      // Attempt to create the machine
      const newMachine = await RentMachine.create(data);

      res.status(201).json({
        success: true,
        message: "Rent machine created successfully",
        rentMachine: newMachine,
      });
    } catch (error) {
      console.error("Error creating rent machine:", error);

      // Handle unique constraint error (duplicate serial_no + rented_by)
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({
          success: false,
          message:
            "A rent machine with the same serial number already exists for this branch.",
          details: error.errors?.map((e) => e.message) || [],
        });
      }

      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  // Get All Rent Machines
  async getAllRentMachines(req, res) {
    try {
      const machines = await RentMachine.findAll({
        include: [
          { model: Category, attributes: ["cat_id", "cat_name"] },
          { model: Supplier, attributes: ["supplier_id", "name"] },
        ],
      });

      res
        .status(200)
        .json({
          success: true,
          message: "Rent machines retrieved successfully",
          machines,
        });
    } catch (error) {
      console.error("Error retrieving rent machines:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  // Get Rent Machines by Branch
  async getRentMachinesByBranch(req, res) {
    try {
      const { rented_by } = req.query;

      const machines = await RentMachine.findAll({
        where: { rented_by },
        include: [
          { model: Category, attributes: ["cat_id", "cat_name"] },
          { model: Supplier, attributes: ["supplier_id", "name"] },
        ],
      });

      res
        .status(200)
        .json({
          success: true,
          message: "Machines by branch retrieved successfully",
          machines,
        });
    } catch (error) {
      console.error("Error retrieving by branch:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  // Get Rent Machine by Serial Number
  async getRentMachineBySerial(req, res) {
    try {
      const { serail_no, rented_by } = req.query;

      const machine = await RentMachine.findOne({
        where: { serail_no, rented_by },
        include: [
          { model: Category, attributes: ["cat_id", "cat_name"] },
          { model: Supplier, attributes: ["supplier_id", "name"] },
        ],
      });

      if (!machine) {
        return res
          .status(404)
          .json({ success: false, message: "Machine not found" });
      }

      res
        .status(200)
        .json({
          success: true,
          message: "Machine retrieved successfully",
          machine,
        });
    } catch (error) {
      console.error("Error retrieving machine:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  // Update Rent Machine by rent_item_id
  async updateRentMachine(req, res) {
    try {
      const { rent_item_id } = req.query;
      const updates = req.body;

      const machine = await RentMachine.findOne({ where: { rent_item_id } });

      if (!machine) {
        return res
          .status(404)
          .json({ success: false, message: "Machine not found" });
      }

      await machine.update(updates);

      res
        .status(200)
        .json({
          success: true,
          message: "Machine updated successfully",
          machine,
        });
    } catch (error) {
      console.error("Error updating rent machine:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  // Get Total Machines by Category
  async getTotalRentMachinesByCategory(req, res) {
    try {
      const { rented_by } = req.query;

      const totals = await RentMachine.findAll({
        attributes: [
          [col("RentMachine.cat_id"), "cat_id"],
          [fn("COUNT", col("RentMachine.cat_id")), "total_items"],
        ],
        include: [
          {
            model: Category,
            attributes: ["cat_id", "cat_name"],
          },
        ],
        where: { rented_by },
        group: ["RentMachine.cat_id", "Category.cat_id", "Category.cat_name"],
      });

      res
        .status(200)
        .json({
          success: true,
          message: "Total machines by category retrieved",
          totals,
        });
    } catch (error) {
      console.error("Error getting totals:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  // Get Total Machines by Branch
  async getTotalRentMachinesByBranch(req, res) {
    try {
      const totals = await RentMachine.findAll({
        attributes: [
          "rented_by",
          [fn("COUNT", col("rent_item_id")), "total_items"],
        ],
        group: ["rented_by"],
      });

      res
        .status(200)
        .json({
          success: true,
          message: "Total machines by branch retrieved",
          totals,
        });
    } catch (error) {
      console.error("Error getting totals by branch:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
}

module.exports = new RentMachineController();
