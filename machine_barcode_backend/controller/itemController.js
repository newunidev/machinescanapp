const Category = require('../model/category');
const Item = require('../model/item.js'); 

class ItemController {
  // Method to create a new item
  async createItem(req, res) {
    try {
      const { item_code, serial_no, name, description, branch, cat_id } = req.body;

      // Ensure the category exists
      const category = await Category.findByPk(cat_id);
      if (!category) {
        return res.status(400).json({
          success: false,
          message: 'Category not found'
        });
      }

      // Create the new item
      const newItem = await Item.create({ item_code, serial_no, name, description, branch, cat_id });

      res.status(201).json({
        success: true,
        message: 'Item created successfully',
        itemCreated: newItem
      });
    } catch (error) {
      console.error('Error creating item:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Method to get all items
  async getAllItems(req, res) {
    try {
      const items = await Item.findAll({
        include: {
          model: Category,
          attributes: ['cat_id', 'cat_name'] // Adjust attributes as needed
        }
      });

      res.status(200).json({
        success: true,
        message: 'Items retrieved successfully',
        items: items
      });
    } catch (error) {
      console.error('Error retrieving items:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Method to get items by branch
  async getItemsByBranch(req, res) {
    try {
      const { branch } = req.query;

      let queryOptions = {
        include: {
          model: Category,
          attributes: ['cat_id', 'name'] // Adjust attributes as needed
        }
      };

      if (branch) {
        queryOptions.where = { branch: branch };
      }

      const items = await Item.findAll(queryOptions);

      res.status(200).json({
        success: true,
        message: 'Items retrieved successfully',
        items: items
      });
    } catch (error) {
      console.error('Error retrieving items:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Method to get an item by item_code
  async getItemByItemCode(req, res) {
    try {
      const { item_code } = req.query;

      let queryOptions = {
        include: {
          model: Category,
          attributes: ['cat_id', 'cat_name'] // Adjust attributes as needed
        }
      };

      if (item_code) {
        queryOptions.where = { item_code: item_code };
      }

      const item = await Item.findOne(queryOptions);

      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Item not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Item retrieved successfully',
        item: item
      });
    } catch (error) {
      console.error('Error retrieving item:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Method to update an item by item_code
  async updateItem(req, res) {
    try {
      const { item_code } = req.query;
      const { serial_no, name, description, branch, cat_id } = req.body;

      // Find the item by item_code
      const item = await Item.findOne({ where: { item_code } });

      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Item not found'
        });
      }

      // Update the item with the provided data
      item.serial_no = serial_no !== undefined ? serial_no : item.serial_no;
      item.name = name !== undefined ? name : item.name;
      item.description = description !== undefined ? description : item.description;
      item.branch = branch !== undefined ? branch : item.branch;
      item.cat_id = cat_id !== undefined ? cat_id : item.cat_id;

      // Save the updated item
      await item.save();

      res.status(200).json({
        success: true,
        message: 'Item updated successfully',
        item: item
      });
    } catch (error) {
      console.error('Error updating item:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = new ItemController();
