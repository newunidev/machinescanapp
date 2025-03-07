const Category = require('../model/category');
const Item = require('../model/item.js'); 
const { sequelize } = require('sequelize');
const { Op, fn, col } = require('sequelize'); // Import Sequelize functions

class ItemController {
  // Method to create a new item
  async createItem(req, res) {
    try {
      const { item_code, serial_no, name, description, branch, model_no,box_no,motor_no,cat_id,supplier,brand,condition,import_date } = req.body;

      // Ensure the category exists
      const category = await Category.findByPk(cat_id);
      if (!category) {
        return res.status(400).json({
          success: false,
          message: 'Category not found'
        });
      }

      // Create the new item
      const newItem = await Item.create({ item_code, serial_no, name, description, branch,model_no,box_no,motor_no, cat_id,supplier,brand,condition,import_date });

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

  // Method to update an item by item_code---still not added the coloumns updated by gayan
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

  // Method to get all items for a given branch and category
  async getItemsByBranchAndCategory(req, res) {
    try {
      const { branch, category_id } = req.query;

      let queryOptions = {
        include: {
          model: Category,
          attributes: ['cat_id', 'cat_name'] // Adjust attributes as needed
        }
      };

      // Check if both branch and category_id are provided
      if (branch && category_id) {
        queryOptions.where = {
          branch: branch,
          cat_id: category_id
        };
      } else if (branch) {
        queryOptions.where = { branch: branch };
      } else if (category_id) {
        queryOptions.where = { cat_id: category_id };
      }

      const items = await Item.findAll(queryOptions);

      res.status(200).json({
        success: true,
        message: 'Items retrieved successfully',
        items: items
      });
    } catch (error) {
      console.error('Error retrieving items by branch and category:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }


  //CREATE BULK ITEM OR update existig item

  async createOrUpdateItems(req, res) {
    try {
      const itemsToProcess = req.body.items; // Expecting an array of items
  
      
      // Validate that the input is an array
      if (!Array.isArray(itemsToProcess)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid input. Expected an array of items.',
        });
      }
  
      const processedItems = [];
  
      for (const itemData of itemsToProcess) {
        // Log the serial number being processed
        console.log(itemData.branch);
        
        // Use findOrCreate to create a new item or retrieve the existing one
        const [item, created] = await Item.findOrCreate({
          where: { serial_no: itemData.serial_no }, // Use serial_no as the unique identifier
          defaults: itemData,
          individualHooks: true, // Trigger hooks
        });
  
        // If the item was found, update it
        if (!created) {
          // await item.update(itemData, {
          //   individualHooks: true, // Trigger hooks during update
          // });
            // If the branches are different, skip the update
          if (item.branch !== itemData.branch) {
            console.log(`Skipping update for item ${itemData.serial_no}. Branches do not match.`);
            continue; // Skip to the next item without updating
          }

          // Otherwise, update the item
          await item.update(itemData, {
            individualHooks: true, // Trigger hooks during update
          });
        }
  
        processedItems.push(item);
      }
  
      res.status(200).json({
        success: true,
        message: 'Items processed successfully',
        items: processedItems,
      });
    } catch (error) {
      console.error('Error processing items:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async getTotalItemsByCategory(req, res) {
    try {
      const { branch } = req.query;
  
      const totalItemsByCategory = await Item.findAll({
        attributes: [
          [col('Item.cat_id'), 'cat_id'], // Explicitly specify Item.cat_id
          [fn('COUNT', col('Item.cat_id')), 'total_items']
        ],
        include: [
          {
            model: Category,
            attributes: ['cat_id', 'cat_name'],
          },
        ],
        where: { branch },
        group: ['Item.cat_id', 'Category.cat_id', 'Category.cat_name'],
      });
  
      res.status(200).json({ 
        success: true, 
        message: 'Total items by category retrieved successfully', 
        totalItemsByCategory 
      });
    } catch (error) {
      console.error('Error retrieving items by category:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  async getTotalItemsByBranch(req, res) {
    try {
      const totalItemsByBranch = await Item.findAll({
        attributes: [
          'branch', // Group by branch
          [fn('COUNT', col('item_code')), 'total_items'] // Count items in each branch
        ],
        group: ['branch']
      });
  
      res.status(200).json({ 
        success: true, 
        message: 'Total items by branch retrieved successfully', 
        totalItemsByBranch 
      });
    } catch (error) {
      console.error('Error retrieving items by branch:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }
  
  

  
 
  

  

  
}

module.exports = new ItemController();
