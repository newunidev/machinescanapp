const CategoryPurchaseOrder = require("../model/category_purchaseorder.js");

class CategoryPurchaseOrderController {
  // Create CategoryPurchaseOrder
  async createCategoryPurchaseOrder(req, res) {
    try {
      const data = req.body;

      const { PO_id, cat_id, from_date, to_date } = data;

      // Validation: Prevent duplicate entry with same PO_id, cat_id, from_date, to_date
      const existingRecord = await CategoryPurchaseOrder.findOne({
        where: {
          PO_id,
          cat_id,
          from_date,
          to_date,
        },
      });

      if (existingRecord) {
        return res.status(400).json({
          success: false,
          message:
            "A Category Purchase Order with the same PO ID, Category, and date range already exists.",
        });
      }

      // Create new record
      const newCPO = await CategoryPurchaseOrder.create(data);

      res.status(201).json({
        success: true,
        message: "Category Purchase Order created successfully",
        categoryPurchaseOrder: newCPO,
      });
    } catch (error) {
      console.error("Error creating Category Purchase Order:", error);

      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  // Get All CategoryPurchaseOrders
  async getAllCategoryPurchaseOrders(req, res) {
    try {
      const cpos = await CategoryPurchaseOrder.findAll();

      res.status(200).json({
        success: true,
        message: "Category Purchase Orders retrieved successfully",
        categoryPurchaseOrders: cpos,
      });
    } catch (error) {
      console.error("Error retrieving Category Purchase Orders:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  // Get CategoryPurchaseOrder by ID
  async getCategoryPurchaseOrderById(req, res) {
    try {
      const { id } = req.params;

      const cpo = await CategoryPurchaseOrder.findByPk(id);

      if (!cpo) {
        return res.status(404).json({
          success: false,
          message: "Category Purchase Order not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Category Purchase Order retrieved successfully",
        categoryPurchaseOrder: cpo,
      });
    } catch (error) {
      console.error("Error retrieving Category Purchase Order by ID:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  // Update CategoryPurchaseOrder by ID
  async updateCategoryPurchaseOrder(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const cpo = await CategoryPurchaseOrder.findByPk(id);

      if (!cpo) {
        return res.status(404).json({
          success: false,
          message: "Category Purchase Order not found",
        });
      }

      await cpo.update(updates);

      res.status(200).json({
        success: true,
        message: "Category Purchase Order updated successfully",
        categoryPurchaseOrder: cpo,
      });
    } catch (error) {
      console.error("Error updating Category Purchase Order:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  // Delete CategoryPurchaseOrder by ID
  async deleteCategoryPurchaseOrder(req, res) {
    try {
      const { id } = req.params;

      const cpo = await CategoryPurchaseOrder.findByPk(id);

      if (!cpo) {
        return res.status(404).json({
          success: false,
          message: "Category Purchase Order not found",
        });
      }

      await cpo.destroy();

      res.status(200).json({
        success: true,
        message: "Category Purchase Order deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting Category Purchase Order:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
}

module.exports = new CategoryPurchaseOrderController();
