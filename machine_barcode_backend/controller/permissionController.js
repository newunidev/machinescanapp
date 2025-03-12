const Permission = require('../model/permission');

class PermissionController {
  // Method to create a new permission
  async createPermission(req, res) {
    try {
      const { PermissionName } = req.body;

      // Validate the input
      if (!PermissionName) {
        return res.status(400).json({
          success: false,
          message: 'Permission name is required'
        });
      }

      // Create the new permission
      const newPermission = await Permission.create({ Permission: PermissionName });

      res.status(201).json({
        success: true,
        message: 'Permission created successfully',
        permission: newPermission
      });
    } catch (error) {
      console.error('Error creating permission:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Method to get all permissions
  async getAllPermissions(req, res) {
    try {
      const permissions = await Permission.findAll();

      res.status(200).json({
        success: true,
        message: 'Permissions retrieved successfully',
        permissions: permissions
      });
    } catch (error) {
      console.error('Error retrieving permissions:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = new PermissionController();
