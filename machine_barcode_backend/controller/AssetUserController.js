const AssetUser = require('../model/asset_user'); // Adjust path as needed

class AssetUserController {
  // Get all asset users
  async getAllAssetUsers(req, res) {
    try {
      const users = await AssetUser.findAll();
      res.status(200).json({ success: true, users });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching asset users',
        error: error.message,
      });
    }
  }

  // Create a new asset user
  async createAssetUser(req, res) {
    try {
      const { epf_no, full_name, branch, designation, date_of_joined, date_of_resigned } = req.body;

      // Check if EPF number already exists
      const existingUser = await AssetUser.findOne({ where: { epf_no } });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'EPF number already exists' });
      }

      // Create new asset user
      const newUser = await AssetUser.create({
        epf_no,
        full_name,
        branch,
        designation,
        date_of_joined,
        date_of_resigned: date_of_resigned || null, // Default to NULL if not provided
      });

      res.status(201).json({ success: true, message: 'Asset user created successfully', user: newUser });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating asset user',
        error: error.message,
      });
    }
  }


  // Bulk create or update asset users
  async createOrUpdateAssetUsers(req, res) {
    console.log("Called");
    try {
      const usersToProcess = req.body.users; // Expecting an array of asset users

      // Validate that the input is an array
      if (!Array.isArray(usersToProcess)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid input. Expected an array of asset users.',
        });
      }

      const processedUsers = [];

      for (const userData of usersToProcess) {
        // Log the EPF number being processed
        console.log(`Processing user with EPF number: ${userData.epf_no}`);

        // Use findOrCreate to create a new asset user or retrieve the existing one
        const [user, created] = await AssetUser.findOrCreate({
          where: { epf_no: userData.epf_no }, // Use epf_no as the unique identifier
          defaults: userData,
          individualHooks: true, // Trigger hooks
        });

        // If the user was found, update it
        if (!created) {
          // If the branch or designation is different, skip the update
          if (user.branch !== userData.branch || user.designation !== userData.designation) {
            console.log(`Skipping update for user ${userData.epf_no}. Branch/Designation do not match.`);
            continue; // Skip to the next user without updating
          }

          // Otherwise, update the asset user
          await user.update(userData, {
            individualHooks: true, // Trigger hooks during update
          });
        }

        processedUsers.push(user);
      }

      res.status(200).json({
        success: true,
        message: 'Asset users processed successfully',
        users: processedUsers,
      });
    } catch (error) {
      console.error('Error processing asset users:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
}

module.exports = new AssetUserController();
