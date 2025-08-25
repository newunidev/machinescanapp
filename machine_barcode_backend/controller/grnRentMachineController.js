const GRN_RentMachine = require("../model/grn_rent_machine");
const GRN = require("../model/grn");
const CategoryPurchaseOrder = require("../model/category_purchaseorder");
const RentMachine = require("../model/rent_machine");
const PurchaseOrder = require("../model/purchaseorder");

const sequelize = require("../database");

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

  // Bulk create GRN Rent Machine records with transaction and rollback
  // async bulkCreateGRNRentMachines(req, res) {
  //   try {
  //     const records = req.body; // Expect an array of GRN_RentMachine objects

  //     if (!Array.isArray(records) || records.length === 0) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "No records provided for bulk creation",
  //       });
  //     }

  //     // 1️⃣ Validate required fields & duplicates BEFORE transaction
  //     for (const data of records) {
  //       const { cpo_id, rent_item_id } = data;

  //       if (!grn_id || !cpo_id || !rent_item_id) {
  //         return res.status(400).json({
  //           success: false,
  //           message:
  //             "Missing required fields (grn_id, cpo_id, rent_item_id) in one or more records.",
  //         });
  //       }

  //       const existing = await GRN_RentMachine.findOne({
  //         where: {cpo_id, rent_item_id },
  //       });

  //       if (existing) {
  //         return res.status(400).json({
  //           success: false,
  //           message: `Duplicate entry found for GRN ID ${grn_id}, CPO ID ${cpo_id}, Rent Item ID ${rent_item_id}`,
  //         });
  //       }
  //     }

  //     // 2️⃣ Start transaction only for bulkCreate
  //     const t = await sequelize.transaction();

  //     try {
  //       await GRN_RentMachine.bulkCreate(records, { transaction: t });
  //       await t.commit();

  //       return res.status(201).json({
  //         success: true,
  //         message: "All GRN Rent Machine records created successfully",
  //       });
  //     } catch (bulkError) {
  //       await t.rollback();
  //       console.error("Error during bulk insert:", bulkError);
  //       return res.status(500).json({
  //         success: false,
  //         message: "Error inserting GRN Rent Machine records",
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error in bulk create GRN Rent Machines:", error);
  //     return res.status(500).json({
  //       success: false,
  //       message: "Internal server error during bulk creation",
  //     });
  //   }
  // }

  //abobe method is create, the bolow bulk method is create to try update respective rentmachine is getting update its status and the rent_by branch

  async bulkCreateGRNRentMachines(req, res) {
    try {
      const records = req.body; // Expect an array of GRN_RentMachine objects

      if (!Array.isArray(records) || records.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No records provided for bulk creation",
        });
      }

      // 1️⃣ Validate required fields & duplicates BEFORE transaction
      for (const data of records) {
        const { grn_id, cpo_id, rent_item_id } = data;

        if (!grn_id || !cpo_id || !rent_item_id) {
          return res.status(400).json({
            success: false,
            message:
              "Missing required fields (grn_id, cpo_id, rent_item_id) in one or more records.",
          });
        }

        const existing = await GRN_RentMachine.findOne({
          where: { cpo_id, rent_item_id },
        });

        if (existing) {
          return res.status(400).json({
            success: false,
            message: `Duplicate entry found for GRN ID ${grn_id}, CPO ID ${cpo_id}, Rent Item ID ${rent_item_id}`,
          });
        }
      }

      // 2️⃣ Start transaction only for bulkCreate
      const t = await sequelize.transaction();

      try {
        // Bulk create GRN_RentMachine records
        await GRN_RentMachine.bulkCreate(records, { transaction: t });

        // Update respective RentMachines
        for (const data of records) {
          const { rent_item_id, branch } = data; // make sure branch is in your records
          await RentMachine.update(
            {
              rented_by: branch, // assign branch from record
              machine_status: "Available To Allocation",
            },
            {
              where: { rent_item_id },
              transaction: t,
            }
          );
        }

        await t.commit();

        return res.status(201).json({
          success: true,
          message:
            "All GRN Rent Machine records created successfully and RentMachines updated",
        });
      } catch (bulkError) {
        await t.rollback();
        console.error("Error during bulk insert:", bulkError);
        return res.status(500).json({
          success: false,
          message: "Error inserting GRN Rent Machine records",
        });
      }
    } catch (error) {
      console.error("Error in bulk create GRN Rent Machines:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error during bulk creation",
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

  async getGRNRentMachinesByRentItemId(req, res) {
    try {
      const { rent_item_id } = req.query;

      const records = await GRN_RentMachine.findAll({
        where: { rent_item_id },
        include: [
          {
            model: GRN,
            include: [
              {
                model: PurchaseOrder,
              },
            ],
          },
        ],
      });

      if (!records || records.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No records found for the given rent_item_id",
        });
      }

      res.status(200).json({
        success: true,
        data: records,
      });
    } catch (error) {
      console.error("Error fetching GRN_RentMachine records:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}

module.exports = new GRNRentMachineController();
