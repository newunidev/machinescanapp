const PurchaseOrder = require("../model/purchaseorder.js");
const Supplier = require("../model/supplier.js");
const Employee = require("../model/employee.js");
const { Op } = require("sequelize");

class PurchaseOrderController {
  // Create Purchase Order
  async createPurchaseOrder(req, res) {
    try {
      const data = req.body;

      // Optional: Add validation here if needed

      const newPO = await PurchaseOrder.create(data);

      res.status(201).json({
        success: true,
        message: "Purchase Order created successfully",
        purchaseOrder: newPO,
      });
    } catch (error) {
      console.error("Error creating Purchase Order:", error);

      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  // Get All Purchase Orders
  async getAllPurchaseOrders(req, res) {
    try {
      const purchaseOrders = await PurchaseOrder.findAll();

      res.status(200).json({
        success: true,
        message: "Purchase Orders retrieved successfully",
        purchaseOrders,
      });
    } catch (error) {
      console.error("Error retrieving Purchase Orders:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  // Get Purchase Order by ID
  // async getPurchaseOrderById(req, res) {
  //   try {
  //     const { id } = req.query;

  //     const purchaseOrder = await PurchaseOrder.findByPk(id);

  //     if (!purchaseOrder) {
  //       return res.status(404).json({
  //         success: false,
  //         message: "Purchase Order not found",
  //       });
  //     }

  //     res.status(200).json({
  //       success: true,
  //       message: "Purchase Order retrieved successfully",
  //       purchaseOrder,
  //     });
  //   } catch (error) {
  //     console.error("Error retrieving Purchase Order by ID:", error);
  //     res.status(500).json({ success: false, message: "Internal server error" });
  //   }
  // }
  async getPurchaseOrderById(req, res) {
    try {
      const { id } = req.query;

      const purchaseOrder = await PurchaseOrder.findByPk(id, {
        include: [
          {
            model: Supplier,
            // Remove 'attributes' to include the full Supplier model
          },
          {
            model: Employee,
            // Optional, based on your association naming
            // No attributes restriction; includes full Employee model
          },
        ],
      });

      if (!purchaseOrder) {
        return res.status(404).json({
          success: false,
          message: "Purchase Order not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Purchase Order retrieved successfully",
        purchaseOrder,
      });
    } catch (error) {
      console.error("Error retrieving Purchase Order by ID:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  // Update Purchase Order by ID
  async updatePurchaseOrder(req, res) {
    try {
      const { id } = req.query;
      const { status } = req.body; // only read status from request

      const purchaseOrder = await PurchaseOrder.findByPk(id);

      if (!purchaseOrder) {
        return res.status(404).json({
          success: false,
          message: "Purchase Order not found",
        });
      }

      await purchaseOrder.update({ status }); // only update status

      res.status(200).json({
        success: true,
        message: "Purchase Order status updated successfully",
        purchaseOrder,
      });
    } catch (error) {
      console.error("Error updating Purchase Order:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  // Delete Purchase Order by ID
  async deletePurchaseOrder(req, res) {
    try {
      const { id } = req.params;

      const purchaseOrder = await PurchaseOrder.findByPk(id);

      if (!purchaseOrder) {
        return res.status(404).json({
          success: false,
          message: "Purchase Order not found",
        });
      }

      await purchaseOrder.destroy();

      res.status(200).json({
        success: true,
        message: "Purchase Order deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting Purchase Order:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  // Update Purchase Order by ID
  async updateEntirePurchaseOrder(req, res) {
    try {
      const { id } = req.query; // Purchase Order ID (poId)
      const data = req.body; // All fields to update

      // Check if PO exists
      const purchaseOrder = await PurchaseOrder.findByPk(id);

      if (!purchaseOrder) {
        return res.status(404).json({
          success: false,
          message: "Purchase Order not found",
        });
      }

      // Update all provided fields
      await purchaseOrder.update(data);

      res.status(200).json({
        success: true,
        message: "Purchase Order updated successfully",
        purchaseOrder,
      });
    } catch (error) {
      console.error("Error updating Purchase Order:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}

module.exports = new PurchaseOrderController();
