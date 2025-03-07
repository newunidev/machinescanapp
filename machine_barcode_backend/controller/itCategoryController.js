const ITCategory = require('../model/it_category');

const ItCategoryController = {
    // Create a new IT Category
    async createItCategory(req, res) {
        try {
            const { cat_name } = req.body;

            if (!cat_name) {
                return res.status(400).json({ success: false, message: 'Category name is required' });
            }

            const category = await ITCategory.create({ cat_name });

            res.status(201).json({
                success: true,
                message: 'IT Category created successfully',
                category
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error creating IT Category', error: error.message });
        }
    },

    // Get all IT Categories
    async getAllItCategories(req, res) {
        try {
            const categories = await ITCategory.findAll();
            res.status(200).json({
                success: true,
                message: 'IT Categories retrieved successfully',
                categories
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error retrieving categories', error: error.message });
        }
    },

    // Get IT Category by ID
    async getItCategoryById(req, res) {
        try {
            const { cat_id } = req.query; // Using query instead of params

            if (!cat_id) {
                return res.status(400).json({ success: false, message: 'Category ID is required' });
            }

            const category = await ITCategory.findByPk(cat_id);

            if (!category) {
                return res.status(404).json({ success: false, message: 'Category not found' });
            }

            res.status(200).json({
                success: true,
                message: 'Category retrieved successfully',
                category
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error retrieving category', error: error.message });
        }
    },

    // Delete IT Category by ID
    async deleteItCategory(req, res) {
        try {
            const { cat_id } = req.query; // Using query instead of params

            if (!cat_id) {
                return res.status(400).json({ success: false, message: 'Category ID is required' });
            }

            const deleted = await ITCategory.destroy({ where: { cat_id } });

            if (!deleted) {
                return res.status(404).json({ success: false, message: 'Category not found' });
            }

            res.status(200).json({
                success: true,
                message: 'Category deleted successfully'
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error deleting category', error: error.message });
        }
    }
};

module.exports = ItCategoryController;
