const Category = require("../model/category");
const Item = require("../model/item");
const ItemScan = require("../model/item_scan"); // Assuming you have an ItemScan model
const { Op, Sequelize } = require("sequelize");

class ItemScanController {
  // Method to create a new ItemScan
  async createItemScan(req, res) {
    try {
      const { category_id, item_id, scanned_date, branch } = req.body;

      // Ensure the category exists
      const category = await Category.findByPk(category_id);
      if (!category) {
        return res.status(400).json({
          success: false,
          message: "Category not found",
        });
      }

      // Ensure the item exists
      const item = await Item.findByPk(item_id);
      if (!item) {
        return res.status(400).json({
          success: false,
          message: "Item not found",
        });
      }

      // Convert scanned_date to Date object and set time to 00:00:00
      const scannedDate = new Date(scanned_date);
      scannedDate.setHours(0, 0, 0, 0); // Set time to midnight

      // Create the new item scan
      const newItemScan = await ItemScan.create({
        category_id,
        item_id,
        scanned_date: scannedDate,
        branch,
      });

      res.status(200).json({
        success: true,
        message: "Item scan created successfully",
        itemScanCreated: newItemScan,
      });
    } catch (error) {
      console.error("Error creating item scan:", error);

      // Check if it's a unique constraint error
      if (error.name === "SequelizeUniqueConstraintError") {
        res.status(400).json({
          success: false,
          message: "Already scanned", // Custom message for duplicate entry
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Internal server error", // General error message for other errors
        });
      }
    }
  }

  // Method to get all ItemScans
  async getAllItemScans(req, res) {
    try {
      const itemScans = await ItemScan.findAll({
        include: [
          {
            model: Category,
            attributes: ["cat_id", "cat_name"], // Adjust attributes as needed
          },
          {
            model: Item,
            attributes: ["item_code", "name"], // Adjust attributes as needed
          },
        ],
      });

      res.status(200).json({
        success: true,
        message: "Item scans retrieved successfully",
        itemScans: itemScans,
      });
    } catch (error) {
      console.error("Error retrieving item scans:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async getItemScansByFilter(req, res) {
    try {
      const { branch, category_id, scanned_date } = req.query;

      // Convert scanned_date to Date object and set time to 00:00:00
      const date = new Date(scanned_date);
      date.setHours(0, 0, 0, 0); // Set time to midnight

      // Find item scans based on the provided filters
      const itemScans = await ItemScan.findAll({
        where: {
          branch: branch,
          category_id: category_id,
          scanned_date: date,
        },
        include: [
          {
            model: Category,
            attributes: ["cat_id", "cat_name"], // Adjust attributes as needed
          },
          {
            model: Item,
            attributes: ["item_code", "name"], // Adjust attributes as needed
          },
        ],
      });

      res.status(200).json({
        success: true,
        message: "Item scans retrieved successfully",
        itemScans: itemScans,
      });
    } catch (error) {
      console.error("Error retrieving item scans by filter:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  //method to get unique categories count in item scans
  async getUniqueCategoryCountToday(req, res) {
    try {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      const scanCountByCategoryAndBranch = await ItemScan.findAll({
        attributes: [
          "category_id",
          "branch",
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
            [Op.between]: [todayStart, todayEnd],
          },
        },
        group: ["category_id", "branch", "Category.cat_id"],
      });

      const counts = scanCountByCategoryAndBranch.map((scan) => ({
        category_id: scan.category_id,
        category_name: scan.Category.cat_name,
        current_branch: scan.branch,
        unique_item_count: scan.get("unique_item_count"),
      }));

      res.status(200).json({
        success: true,
        message:
          "Item scan machine count by category and branch for today retrieved successfully",
        counts,
      });
    } catch (error) {
      console.error("Error retrieving unique category count:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}

module.exports = new ItemScanController();
