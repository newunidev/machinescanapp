const Category = require('../model/category');

class CategoryController {
  // Method to create a new Category
  async createCategory(req, res) {
    try {
      const { cat_name } = req.body;

      // Create the new category
      const newCategory = await Category.create({ cat_name });

      res.status(200).json({
        success: true,
        message: 'Category created successfully',
        categoryCreated: newCategory,
      });
    } catch (error) {
      console.error('Error creating category:', error);

      // Check if it's a unique constraint error
      if (error.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({
          success: false,
          message: 'Category already exists',  // Custom message for duplicate entry
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Internal server error',  // General error message for other errors
        });
      }
    }
  }

  // Method to get all Categories
  async getAllCategories(req, res) {
    try {
      const categories = await Category.findAll({
        attributes: ['cat_id', 'cat_name'], // Adjust attributes as needed
      });

      res.status(200).json({
        success: true,
        message: 'Categories retrieved successfully',
        categories: categories,
      });
    } catch (error) {
      console.error('Error retrieving categories:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
}

module.exports = new CategoryController();
