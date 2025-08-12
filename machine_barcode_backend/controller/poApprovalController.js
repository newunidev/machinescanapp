const POApproval = require("../model/po_approval");
const Employee = require("../model/employee");
const PurchaseOrder = require("../model/purchaseorder");
const Supplier = require("../model/supplier");

class POApprovalController {
  // Create a new PO Approval
  async createPOApproval(req, res) {
    try {
      const data = req.body;
      console.log(data);
      const {
        po_no,
        approval1,
        approval1_by,
        approved1_date,
        approval2,
        approval2_by,
        approved2_date,
      } = data;

      // Basic validation
      if (!po_no) {
        return res.status(400).json({
          success: false,
          message:
            "Required fields are missing (po_no, approval1_by, approval2_by).",
        });
      }

      const poApproval = await POApproval.create(data);

      res.status(201).json({
        success: true,
        message: "PO Approval created successfully.",
        poApproval,
      });
    } catch (error) {
      console.error("Error creating PO Approval:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error while creating PO Approval.",
      });
    }
  }

  async getAllPOApprovals(req, res) {
    try {
      const approvals = await POApproval.findAll({
        include: [
          {
            model: PurchaseOrder,
            include: [
              {
                model: Employee,
              },
              {
                model: Supplier,
              },
            ],
          },
          {
            model: Employee,
            as: "FirstApprover",
          },
          {
            model: Employee,
            as: "SecondApprover",
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json({
        success: true,
        message: "PO Approvals retrieved successfully.",
        approvals,
      });
    } catch (error) {
      console.error("Error retrieving PO Approvals:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error while retrieving PO Approvals.",
      });
    }
  }

  // Get PO Approval by PO Number
  async getPOApprovalByPOID(req, res) {
    try {
      const { po_no } = req.query;

      if (!po_no) {
        return res.status(400).json({
          success: false,
          message: "PO Number is required.",
        });
      }

      const approval = await POApproval.findOne({
        where: { po_no },
        include: [
          {
            model: Employee,
            as: "FirstApprover",
            attributes: [
              "employee_id",
              "name",
              "email",
              "branch",
              "designation",
            ],
          },
          {
            model: Employee,
            as: "SecondApprover",
            attributes: [
              "employee_id",
              "name",
              "email",
              "branch",
              "designation",
            ],
          },
        ],
      });

      if (!approval) {
        return res.status(404).json({
          success: false,
          message: "PO Approval not found for the given PO number.",
        });
      }

      res.status(200).json({
        success: true,
        message: "PO Approval retrieved successfully.",
        poApproval: approval,
      });
    } catch (error) {
      console.error("Error retrieving PO Approval by PO number:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error while retrieving PO Approval.",
      });
    }
  }

  // Update Approval 1
  async updateApproval1(req, res) {
    try {
      const { po_no, approval1_by, approval1 } = req.body;

      if (!po_no || !approval1_by) {
        return res.status(400).json({
          success: false,
          message: "po_no and approval1_by are required.",
        });
      }

      const [updated] = await POApproval.update(
        {
          approval1,
          approval1_by,
          approved1_date: new Date(), // Set today's date
        },
        {
          where: { po_no },
        }
      );

      if (updated === 0) {
        return res.status(404).json({
          success: false,
          message: "PO Approval not found.",
        });
      }

      res.status(200).json({
        success: true,
        message: "Approval 1 updated successfully.",
      });
    } catch (error) {
      console.error("Error updating Approval 1:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error while updating Approval 1.",
      });
    }
  }

  // Update Approval 2
  async updateApproval2(req, res) {
    try {
      const { po_no, approval2_by, approval2 } = req.body;

      if (!po_no || !approval2_by) {
        return res.status(400).json({
          success: false,
          message: "po_no and approval2_by are required.",
        });
      }

      const [updated] = await POApproval.update(
        {
          approval2,
          approval2_by,
          approved2_date: new Date(), // Set today's date
        },
        {
          where: { po_no },
        }
      );

      if (updated === 0) {
        return res.status(404).json({
          success: false,
          message: "PO Approval not found.",
        });
      }

      res.status(200).json({
        success: true,
        message: "Approval 2 updated successfully.",
      });
    } catch (error) {
      console.error("Error updating Approval 2:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error while updating Approval 2.",
      });
    }
  }
}

module.exports = new POApprovalController();
