const Category = require("../model/category");
const Item = require("../model/item");
const IdleScan = require("../model/idle_scan"); // Assuming you have an IdleScan model
const { Sequelize } = require("sequelize");
const { Op } = require("sequelize"); // Import Op for exact match

class IdleScanController {
  // Method to create a new IdleScan
  async createIdleScan(req, res) {
    try {
      const { category_id, item_id, scanned_date, branch, current_branch } =
        req.body;

      // Ensure the category exists
      const category = await Category.findByPk(category_id);
      if (!category) {
        return res
          .status(400)
          .json({ success: false, message: "Category not found" });
      }

      // Ensure the item exists
      const item = await Item.findByPk(item_id);
      if (!item) {
        return res
          .status(400)
          .json({ success: false, message: "Item not found" });
      }

      // Convert scanned_date to Date object and set time to 00:00:00
      const scannedDate = new Date(scanned_date);
      scannedDate.setHours(0, 0, 0, 0);

      // Create the new idle scan
      const newIdleScan = await IdleScan.create({
        category_id,
        item_id,
        scanned_date: scannedDate,
        branch,
        current_branch,
      });

      res.status(200).json({
        success: true,
        message: "Idle scan created successfully",
        idleScanCreated: newIdleScan,
      });
    } catch (error) {
      console.error("Error creating idle scan:", error);
      if (error.name === "SequelizeUniqueConstraintError") {
        res.status(400).json({ success: false, message: "Already scanned" });
      } else {
        res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }
    }
  }

  // Method to update an existing IdleScan (update current_branch)
  async updateIdleScan(req, res) {
    try {
      const { idleScan_id, current_branch } = req.body;

      const idleScan = await IdleScan.findByPk(idleScan_id);
      if (!idleScan) {
        return res
          .status(404)
          .json({ success: false, message: "Idle scan not found" });
      }

      idleScan.current_branch = current_branch;
      await idleScan.save();

      res.status(200).json({
        success: true,
        message: "Idle scan updated successfully",
        idleScanUpdated: idleScan,
      });
    } catch (error) {
      console.error("Error updating idle scan:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  // Method to get all IdleScans
  async getAllIdleScans(req, res) {
    try {
      const idleScans = await IdleScan.findAll({
        include: [
          { model: Category, attributes: ["cat_id", "cat_name"] },
          { model: Item, attributes: ["item_code", "name"] },
        ],
      });

      res.status(200).json({
        success: true,
        message: "Idle scans retrieved successfully",
        idleScans,
      });
    } catch (error) {
      console.error("Error retrieving idle scans:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  // Method to get IdleScans based on filters
  async getIdleScansByFilter(req, res) {
    try {
      const { branch, category_id, scanned_date } = req.query;
      const date = new Date(scanned_date);
      date.setHours(0, 0, 0, 0);

      const idleScans = await IdleScan.findAll({
        where: { branch, category_id, scanned_date: date },
        include: [
          { model: Category, attributes: ["cat_id", "cat_name"] },
          { model: Item, attributes: ["item_code", "name"] },
        ],
      });

      res.status(200).json({
        success: true,
        message: "Idle scans retrieved successfully",
        idleScans,
      });
    } catch (error) {
      console.error("Error retrieving idle scans by filter:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  // Method to get IdleScans based on filters including current branch
  async getIdleScansByFilterCurrentBranch(req, res) {
    try {
      const { branch, category_id, scanned_date, current_branch } = req.query;
      const date = new Date(scanned_date);
      date.setHours(0, 0, 0, 0);

      const idleScans = await IdleScan.findAll({
        where: { branch, category_id, scanned_date: date, current_branch },
        include: [
          { model: Category, attributes: ["cat_id", "cat_name"] },
          { model: Item, attributes: ["item_code", "name"] },
        ],
      });

      res.status(200).json({
        success: true,
        message: "Idle scans retrieved successfully",
        idleScans,
      });
    } catch (error) {
      console.error("Error retrieving idle scans by filter:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  // Method to get IdleScans count by category
  async getIdleScanCountByCategory(req, res) {
    try {
      const idleScanCounts = await IdleScan.findAll({
        attributes: [
          "category_id",
          [Sequelize.fn("COUNT", Sequelize.col("category_id")), "count"],
        ],
        include: [{ model: Category, attributes: ["cat_id", "cat_name"] }],
        group: ["category_id", "Category.cat_id", "Category.cat_name"],
      });

      res.status(200).json({
        success: true,
        message: "Idle scan counts by category retrieved successfully",
        idleScanCounts,
      });
    } catch (error) {
      console.error("Error retrieving idle scan counts:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  // Method to get IdleScans count by category, filtered by branch and scanned_date
  async getIdleScanCountByCategoryBranchDate(req, res) {
    try {
      const { current_branch, scanned_date } = req.query;
      console.log(current_branch, scanned_date);

      // Convert scanned_date to a Date object and normalize time
      const date = new Date(scanned_date);
      date.setHours(0, 0, 0, 0);

      const idleScanCounts = await IdleScan.findAll({
        attributes: [
          "category_id",
          [Sequelize.fn("COUNT", Sequelize.col("category_id")), "count"],
        ],
        where: { current_branch, scanned_date: date },
        include: [{ model: Category, attributes: ["cat_id", "cat_name"] }],
        group: ["category_id", "Category.cat_id", "Category.cat_name"],
      });

      res.status(200).json({
        success: true,
        message: "Idle scan counts by category retrieved successfully",
        idleScanCounts,
      });
    } catch (error) {
      console.error("Error retrieving idle scan counts:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  //method to get idleScans with category id, date,current_branch

  async getIdleScansByFilterCurrentBranchOnly(req, res) {
    try {
      const { category_id, scanned_date, current_branch } = req.query;
      const date = new Date(scanned_date);
      date.setHours(0, 0, 0, 0);

      const idleScans = await IdleScan.findAll({
        where: { category_id, scanned_date: date, current_branch },
        include: [
          { model: Category, attributes: ["cat_id", "cat_name"] },
          {
            model: Item,
            attributes: [
              "item_code",
              "name",
              "description",
              "serial_no",
              "branch",
            ],
          },
        ],
      });

      res.status(200).json({
        success: true,
        message: "Idle scans retrieved successfully",
        idleScans,
      });
    } catch (error) {
      console.error("Error retrieving idle scans by filter:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  // Method to get the latest scan records
  async getLatestIdleScans(req, res) {
    try {
      // Fetch the latest scan record per item using a subquery
      const latestIdleScans = await IdleScan.findAll({
        include: [
          { model: Category, attributes: ["cat_id", "cat_name"] },
          { model: Item, attributes: ["item_code", "name"] },
        ],
        where: Sequelize.where(
          Sequelize.col("scanned_date"),
          Sequelize.Op.in,
          Sequelize.literal(
            `(SELECT MAX(scanned_date) FROM IdleScans GROUP BY item_id)`
          )
        ),
        order: [["scanned_date", "DESC"]],
      });

      res.status(200).json({
        success: true,
        message: "Latest idle scans retrieved successfully",
        latestIdleScans,
      });
    } catch (error) {
      console.error("Error retrieving latest idle scans:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async getIdleScanCountByCategory3DaysBefore(req, res) {
    try {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3); // Get the date 3 days ago

      // Fetch the count of unique idle scan machines per category and branch within the last 3 days
      const scanCountByCategoryAndBranch = await IdleScan.findAll({
        attributes: [
          "category_id", // Group by category
          "current_branch", // Group by current_branch
          [
            Sequelize.fn(
              "COUNT",
              Sequelize.fn("DISTINCT", Sequelize.col("item_id"))
            ),
            "unique_item_count",
          ], // Count distinct item_id
        ],
        include: [
          {
            model: Category, // Include category model
            attributes: ["cat_id", "cat_name"],
          },
        ],
        where: {
          scanned_date: {
            [Sequelize.Op.between]: [threeDaysAgo, new Date()], // Filter for last 3 days
          },
        },
        group: ["category_id", "current_branch"], // Group by category_id and current_branch
      });

      // If you want to return the count per category along with category names and branch
      const counts = scanCountByCategoryAndBranch.map((scan) => ({
        category_id: scan.category_id,
        category_name: scan.Category.cat_name, // Getting category name from the Category model
        current_branch: scan.current_branch, // Getting current branch
        unique_item_count: scan.get("unique_item_count"),
      }));

      res.status(200).json({
        success: true,
        message:
          "Idle scan machine count by category and branch retrieved successfully",
        counts,
      });
    } catch (error) {
      console.error(
        "Error retrieving idle scan machine count by category and branch:",
        error
      );
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  //get idle records to given branch (current brancg)and cateogry
  async getIdleScanByCategoryAndBranch3Days(req, res) {
    try {
      const { categoryId, branch } = req.query; // Assuming categoryId and branch are passed as route parameters

      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3); // Get the date 3 days ago

      // Fetch unique idle scan machine records for the given category and branch within the last 3 days
      const idleScanRecords = await IdleScan.findAll({
        attributes: [
          "item_id", // Getting unique item_id
          [Sequelize.fn("MAX", Sequelize.col("scanned_date")), "scanned_date"], // Use MAX for scanned_date
          [
            Sequelize.fn(
              "COUNT",
              Sequelize.fn("DISTINCT", Sequelize.col("item_id"))
            ),
            "unique_item_count",
          ], // Count distinct item_id
          [Sequelize.col("Category.cat_id"), "cat_id"], // Include category ID
          [Sequelize.col("Category.cat_name"), "cat_name"], // Include category name
          [Sequelize.col("Item.item_code"), "item_code"], // Include item code
          [Sequelize.col("Item.name"), "item_name"], // Include item name
        ],
        include: [
          {
            model: Category, // Include category model
            where: { cat_id: categoryId }, // Filter by category
            attributes: [], // Don't need to return category columns here as they are already included above
          },
          {
            model: Item, // Include item model
            attributes: [], // Don't need to return item columns here as they are already included above
          },
        ],
        where: {
          scanned_date: {
            [Sequelize.Op.between]: [threeDaysAgo, new Date()], // Filter for last 3 days
          },
          current_branch: branch, // Filter by branch
        },
        group: ["item_id", "Category.cat_id", "Item.item_code"], // Group by item_id, category_id, and item_code
        order: [["scanned_date", "DESC"]], // Order by most recent scan
      });

      // If you want to return the details of each unique idle machine
      const records = idleScanRecords.map((record) => ({
        item_id: record.item_id,
        item_code: record.item_code,
        item_name: record.item_name,
        scanned_date: record.scanned_date,
        unique_item_count: record.get("unique_item_count"),
        category_name: record.cat_name,
      }));

      res.status(200).json({
        success: true,
        message:
          "Unique idle machine records by category and branch retrieved successfully",
        records,
      });
    } catch (error) {
      console.error("Error retrieving unique idle machine records:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  //method to get the latest scan details todays date
  async getIdleScanCountByCategoryToday(req, res) {
    try {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0); // Set time to 00:00:00

      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999); // Set time to 23:59:59

      const scanCountByCategoryAndBranch = await IdleScan.findAll({
        attributes: [
          "category_id",
          "current_branch",
          [
            Sequelize.fn(
              "COUNT",
              Sequelize.fn("DISTINCT", Sequelize.col("item_id"))
            ),
            "unique_item_count",
          ],
        ],
        include: [
          {
            model: Category,
            attributes: ["cat_id", "cat_name"],
          },
        ],
        where: {
          scanned_date: {
            [Sequelize.Op.between]: [todayStart, todayEnd], // Filter only today's data
          },
        },
        group: ["category_id", "current_branch"],
      });

      const counts = scanCountByCategoryAndBranch.map((scan) => ({
        category_id: scan.category_id,
        category_name: scan.Category.cat_name,
        current_branch: scan.current_branch,
        unique_item_count: scan.get("unique_item_count"),
      }));

      res.status(200).json({
        success: true,
        message:
          "Idle scan machine count by category and branch for today retrieved successfully",
        counts,
      });
    } catch (error) {
      console.error(
        "Error retrieving idle scan machine count by category and branch:",
        error
      );
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  //method to get the idle scan records for todays date.
  // method to get Idle Scan Records by category and branch for today's date
  async getIdleScanByCategoryAndBranchToday(req, res) {
    try {
      const { category_id, current_branch } = req.query;

      if (!category_id || !current_branch) {
        return res.status(400).json({
          success: false,
          message: "category_id and current_branch are required",
        });
      }

      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      const idleScans = await IdleScan.findAll({
        where: {
          category_id: category_id,
          current_branch: current_branch,
          scanned_date: {
            [Op.between]: [todayStart, todayEnd],
          },
        },
        include: [
          {
            model: Category,
            attributes: ["cat_id", "cat_name"],
          },
        ],
      });
      
      // Fetch item details for each idle scan
      const updatedIdleScans = await Promise.all(
        idleScans.map(async (scan) => {
          console.log(scan.item_id);
          const item = await Item.findOne({
            where: { item_code: scan.item_id },  // or scan.item_id
            attributes: [
              "item_code",
              "serial_no",
              "name",
              "description",
              "branch",
              "box_no",
              "model_no",
              "motor_no",
              "supplier",
              "brand",
              "condition",
              "import_date",
            ],
          });
      
          return {
            ...scan.toJSON(),
            item: item ? item.toJSON() : null,
          };
        })
      );

      res.status(200).json({
        success: true,
        message: "Idle scan records retrieved successfully",
        data: updatedIdleScans,
      });
    } catch (error) {
      console.error(
        "Error retrieving idle scan records by category and branch for today:",
        error
      );
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}

module.exports = new IdleScanController();
