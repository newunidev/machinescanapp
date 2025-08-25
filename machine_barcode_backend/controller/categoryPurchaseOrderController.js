const CategoryPurchaseOrder = require("../model/category_purchaseorder.js");
const Category = require("../model/category.js");
const PurchaseOrder = require("../model/purchaseorder.js");
const Supplier = require("../model/supplier.js");

const sequelize = require("../database");
const { Op } = require("sequelize");

class CategoryPurchaseOrderController {
  // Create single CategoryPurchaseOrder
  async createCategoryPurchaseOrder(req, res) {
    try {
      const data = req.body;

      const { PO_id, cat_id, Qty, PerDay_Cost, d_percent, from_date, to_date } =
        data;
      console.log("Data cat:", data);
      // Basic validation for required fields
      if (
        !PO_id ||
        !cat_id ||
        Qty == null ||
        PerDay_Cost == null ||
        d_percent == null ||
        !from_date ||
        !to_date
      ) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields.",
        });
      }

      // Prevent duplicate exact entries
      const existingRecord = await CategoryPurchaseOrder.findOne({
        where: { PO_id, cat_id, from_date, to_date },
      });

      if (existingRecord) {
        return res.status(400).json({
          success: false,
          message:
            "A Category Purchase Order with the same PO ID, Category, and date range already exists.",
        });
      }

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

  async bulkCreateCategoryPurchaseOrders(req, res) {
    try {
      const records = req.body; // Expect array of full CPO objects

      if (!Array.isArray(records) || records.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No records provided for bulk creation",
        });
      }

      // 1️⃣ Basic validation for required fields
      for (const data of records) {
        const {
          PO_id,
          cat_id,
          Qty,
          PerDay_Cost,
          d_percent,
          from_date,
          to_date,
        } = data;
        if (
          !PO_id ||
          !cat_id ||
          Qty == null ||
          PerDay_Cost == null ||
          d_percent == null ||
          !from_date ||
          !to_date
        ) {
          return res.status(400).json({
            success: false,
            message: "Missing required fields in one or more records.",
          });
        }
      }

      // 2️⃣ Check for duplicates in DB before starting transaction
      const duplicates = await CategoryPurchaseOrder.findAll({
        where: {
          [Op.or]: records.map((r) => ({
            PO_id: r.PO_id,
            cat_id: r.cat_id,
            from_date: r.from_date,
            to_date: r.to_date,
          })),
        },
      });

      if (duplicates.length > 0) {
        const dup = duplicates[0];
        return res.status(400).json({
          success: false,
          message: `Duplicate entry found for PO ID ${dup.PO_id}, Category ID ${dup.cat_id}, Date Range (${dup.from_date} - ${dup.to_date})`,
        });
      }

      // 3️⃣ Create all records within a transaction
      const t = await sequelize.transaction();
      try {
        await CategoryPurchaseOrder.bulkCreate(records, { transaction: t });
        await t.commit();
      } catch (error) {
        await t.rollback();
        throw error;
      }

      res.status(201).json({
        success: true,
        message: "All Category Purchase Orders created successfully",
      });
    } catch (error) {
      console.error("Error in bulk create:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error during bulk creation",
      });
    }
  }

  // Get all CategoryPurchaseOrders
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

  //method to get all catego
  // Get all CategoryPurchaseOrders by PO ID
  // async getCategoryPurchaseOrdersByPOId(req, res) {
  //   try {
  //     const { poid } = req.query;

  //     if (!poid) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "PO ID is required.",
  //       });
  //     }

  //     const cpos = await CategoryPurchaseOrder.findAll({
  //       where: { PO_id: poid },
  //       include: [
  //         {
  //           model: Category, // include full category model
  //         },
  //         {
  //           model: PurchaseOrder,
  //           include: [
  //             {
  //               model: Supplier, // include Supplier inside PurchaseOrder
  //             },
  //           ],
  //         },
  //       ],
  //     });

  //     res.status(200).json({
  //       success: true,
  //       message: `Category Purchase Orders for PO ID ${poid} retrieved successfully`,
  //       categoryPurchaseOrders: cpos,
  //     });
  //   } catch (error) {
  //     console.error(
  //       "Error retrieving Category Purchase Orders by PO ID:",
  //       error
  //     );
  //     res.status(500).json({
  //       success: false,
  //       message: "Internal server error",
  //     });
  //   }
  // }
  async getCategoryPurchaseOrdersByPOId(req, res) {
    try {
      const { poid } = req.query;

      if (!poid) {
        return res.status(400).json({
          success: false,
          message: "PO ID is required.",
        });
      }

      // Fetch purchase order with supplier
      const purchaseOrder = await PurchaseOrder.findOne({
        where: { POID: poid },
        include: [
          {
            model: Supplier,
          },
        ],
      });

      if (!purchaseOrder) {
        return res.status(404).json({
          success: false,
          message: "Purchase Order not found.",
        });
      }

      // Fetch all category purchase orders with category
      const categoryPurchaseOrders = await CategoryPurchaseOrder.findAll({
        where: { PO_id: poid },
        include: [
          {
            model: Category,
          },
        ],
      });

      res.status(200).json({
        success: true,
        message: `Category Purchase Orders for PO ID ${poid} retrieved successfully`,
        purchaseOrder,
        categoryPurchaseOrders,
      });
    } catch (error) {
      console.error(
        "Error retrieving Category Purchase Orders by PO ID:",
        error
      );
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  //bulk update or create
  // async bulkCreateAndUpdateCategoryPurchaseOrders(req, res) {
  //   try {
  //     const records = req.body; // Expect array of objects
  //     console.log("records",records);
  //     if (!Array.isArray(records) || records.length === 0) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "No records provided",
  //       });
  //     }

  //     // ✅ Validate first OUTSIDE of transaction
  //     for (const data of records) {
  //       const {
  //         PO_id,
  //         cat_id,
  //         Qty,
  //         PerDay_Cost,
  //         d_percent,
  //         from_date,
  //         to_date,
  //       } = data;

  //       if (
  //         !PO_id ||
  //         !cat_id ||
  //         Qty == null ||
  //         PerDay_Cost == null ||
  //         d_percent == null ||
  //         !from_date ||
  //         !to_date
  //       ) {
  //         return res.status(400).json({
  //           success: false,
  //           message: "Missing required fields in one or more records",
  //         });
  //       }
  //     }

  //     // ✅ Only start transaction when modifying data
  //     const t = await sequelize.transaction();
  //     try {
  //       for (const data of records) {
  //         const {
  //           cpo_id,
  //           PO_id,
  //           cat_id,
  //           Qty,
  //           PerDay_Cost,
  //           d_percent,
  //           from_date,
  //           to_date,
  //         } = data;

  //         if (cpo_id) {
  //           // Check existence WITHOUT transaction
  //           const existing = await CategoryPurchaseOrder.findByPk(cpo_id);
  //           if (existing) {
  //             // Update WITHIN transaction
  //             await existing.update(
  //               {
  //                 PO_id,
  //                 cat_id,
  //                 Qty,
  //                 PerDay_Cost,
  //                 d_percent,
  //                 from_date,
  //                 to_date,
  //               },
  //               { transaction: t }
  //             );
  //             continue;
  //           }
  //         }

  //         // Create new WITHIN transaction
  //         await CategoryPurchaseOrder.create(
  //           { PO_id, cat_id, Qty, PerDay_Cost, d_percent, from_date, to_date },
  //           { transaction: t }
  //         );
  //       }

  //       await t.commit();
  //       return res.status(200).json({
  //         success: true,
  //         message: "Category Purchase Orders created/updated successfully",
  //       });
  //     } catch (err) {
  //       await t.rollback();
  //       throw err;
  //     }
  //   } catch (error) {
  //     console.error("Error in bulk create/update:", error);
  //     return res.status(500).json({
  //       success: false,
  //       message: "Internal server error during bulk create/update",
  //       error: error.message,
  //     });
  //   }
  // }

  async bulkCreateAndUpdateCategoryPurchaseOrders(req, res) {
    try {
      const records = req.body; // Expect array of objects
      console.log("records", records);

      if (!Array.isArray(records) || records.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No records provided",
        });
      }

      // 1️⃣ Validate input fields (outside of transaction)
      for (const data of records) {
        const {
          PO_id,
          cat_id,
          Qty,
          PerDay_Cost,
          d_percent,
          from_date,
          to_date,
          description,
        } = data;

        if (
          !PO_id ||
          !cat_id ||
          Qty == null ||
          PerDay_Cost == null ||
          d_percent == null ||
          !from_date ||
          !to_date
        ) {
          return res.status(400).json({
            success: false,
            message: "Missing required fields in one or more records",
          });
        }
      }

      // 2️⃣ Check duplicates ONLY for new records (cpo_id not provided)
      const newRecords = records.filter((r) => !r.cpo_id);

      if (newRecords.length > 0) {
        const duplicates = await CategoryPurchaseOrder.findAll({
          where: {
            [Op.or]: newRecords.map((r) => ({
              PO_id: r.PO_id,
              cat_id: r.cat_id,
              from_date: r.from_date,
              to_date: r.to_date,
            })),
          },
        });

        if (duplicates.length > 0) {
          const dup = duplicates[0];
          return res.status(400).json({
            success: false,
            message: `Duplicate entry found for PO ID ${dup.PO_id}, Category ID ${dup.cat_id}, Date Range (${dup.from_date} - ${dup.to_date})`,
          });
        }
      }

      // 3️⃣ Start transaction for create/update
      const t = await sequelize.transaction();
      try {
        for (const data of records) {
          const {
            cpo_id,
            PO_id,
            cat_id,
            Qty,
            PerDay_Cost,
            d_percent,
            from_date,
            to_date,
            description,
          } = data;

          if (cpo_id) {
            // Check for conflict with other records before updating
            const conflict = await CategoryPurchaseOrder.findOne({
              where: {
                PO_id,
                cat_id,
                from_date,
                to_date,
                cpo_id: { [Op.ne]: cpo_id }, // ignore the current record
              },
            });

            if (conflict) {
              await t.rollback();
              return res.status(400).json({
                success: false,
                message: `Cannot update. Another record already exists for PO ID ${PO_id}, Category ID ${cat_id}, Date Range (${from_date} - ${to_date})`,
              });
            }

            // Safe to update
            const existing = await CategoryPurchaseOrder.findByPk(cpo_id);
            if (existing) {
              await existing.update(
                {
                  PO_id,
                  cat_id,
                  Qty,
                  PerDay_Cost,
                  d_percent,
                  from_date,
                  to_date,
                  description,
                },
                { transaction: t }
              );
              continue;
            }
          }

          // Create new record
          await CategoryPurchaseOrder.create(
            { PO_id, cat_id, Qty, PerDay_Cost, d_percent, from_date, to_date,description },
            { transaction: t }
          );
        }

        await t.commit();
        return res.status(200).json({
          success: true,
          message: "Category Purchase Orders created/updated successfully",
        });
      } catch (err) {
        await t.rollback();
        throw err;
      }
    } catch (error) {
      console.error("Error in bulk create/update:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error during bulk create/update",
        error: error.message,
      });
    }
  }
}

module.exports = new CategoryPurchaseOrderController();
