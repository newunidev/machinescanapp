
const AssetAssignment = require('../model/asset_assignment');
const ITAsset = require('../model/it_asset');
const AssetUser = require('../model/asset_user');
const sequelize = require('../database');
 // Import models

class AssetAssignmentController {
  
  // Create multiple asset assignments with only assigned date and current user
  async createAssetAssignments(req, res) {
    try {
      const { assetId, assetUserId, is_current_user, assignedDate } = req.body;
  
      // Validate if necessary fields are provided
      if (!assetId || !assetUserId || !assignedDate) {
        return res.status(400).json({ success: false, message: 'Asset ID, Asset User ID, and Assigned Date are required' });
      }
  
      // Find the asset based on assetId
      const asset = await ITAsset.findOne({ where: { asset_id: assetId } });
      if (!asset) {
        return res.status(404).json({ success: false, message: 'Asset not found' });
      }
  
      // Ensure the asset user exists in the AssetUser table
      const assetUser = await AssetUser.findOne({ where: { id: assetUserId } });
      if (!assetUser) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      // Check if an existing assignment already has the current user flag set to true
      if (is_current_user) {
        const existingAssignment = await AssetAssignment.findOne({
          where: {
            it_asset_id: assetId,
            isCurrentUser: true,
          },
        });
  
        if (existingAssignment) {
          return res.status(400).json({
            success: false,
            message: 'This asset is already assigned to a user as the current asset.',
          });
        }
      }
  
      // Create asset assignment
      const assetAssignment = await AssetAssignment.create({
        it_asset_id: asset.asset_id, // Foreign key to ITAsset
        asset_user_id: assetUserId, // Foreign key to AssetUser
        is_current_user: is_current_user || false, // Default to false if not provided
        assigned_date: assignedDate, // Set the assigned date
        returned_date: null, // returned_date defaults to null as it's not needed initially
      });
  
      res.status(201).json({
        success: true,
        message: 'Asset assignment created successfully',
        assetAssignment,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Error creating asset assignment',
        error: error.message,
      });
    }
  }
  
  
  
  

  // Get asset assignments for a given asset ID
  // Get asset assignments for a given asset ID
  async getAssetAssignmentsByAssetId(req, res) {
    try {
      const { asset_id } = req.query;
      console.log('Requested asset_id:', asset_id); // Log the requested asset_id
  
      // Fetch the asset
      const asset = await ITAsset.findOne({ where: { asset_id } });
      if (!asset) {
        console.log('Asset not found for asset_id:', asset_id); // Log if asset is not found
        return res.status(404).json({ success: false, message: 'Asset not found' });
      }
      console.log('Found asset:', asset.toJSON()); // Log the found asset
  
      // Fetch the assignments, including AssetUser directly
      const assignments = await AssetAssignment.findAll({
        where: { it_asset_id: asset.asset_id },
        include: [
          {
            model: AssetUser,
            as: 'users', // Use the alias defined in the association
            attributes: ['epf_no', 'full_name', 'branch', 'designation'],
          },
        ],
      });
      console.log('Assignments found:', assignments.map(a => a.toJSON())); // Log the assignments
  
      if (assignments.length === 0) {
        console.log('No assignments found for asset_id:', asset_id); // Log if no assignments are found
        return res.status(404).json({ success: false, message: 'No assignments found for this asset' });
      }
  
      res.status(200).json({
        success: true,
        assetAssignments: assignments,
      });
    } catch (error) {
      console.error('Error in getAssetAssignmentsByAssetId:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching asset assignments',
        error: error.message,
      });
    }
  }
  


  // Get asset assignment for a given user (by EPF number)
  async getAssetAssignmentsByUser(req, res) {
    try {
      const { epf_no } = req.params;

      const user = await AssetUser.findOne({ where: { epf_no } });
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const assignments = await AssetAssignment.findAll({
        where: { asset_user_epf_no: user.epf_no },
        include: [
          {
            model: ITAsset,
            as: 'asset', // Alias to reference ITAsset records
            attributes: ['asset_id', 'serial_no', 'name', 'brand'],
          }
        ],
      });

      if (assignments.length === 0) {
        return res.status(404).json({ success: false, message: 'No assignments found for this user' });
      }

      res.status(200).json({
        success: true,
        assetAssignments: assignments,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Error fetching asset assignments for user',
        error: error.message,
      });
    }
  }
}

module.exports = new AssetAssignmentController();
