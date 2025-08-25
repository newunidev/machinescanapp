const Branch = require('../model/branch'); // Adjust the path as needed

class BranchController {
  // Get all branches
  async getAllBranches(req, res) {
    try {
      const branches = await Branch.findAll();
      res.status(200).json({ success: true, branches });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching branches',
        error: error.message,
      });
    }
  }

  // Create a new branch
  async createBranch(req, res) {
    try {
      const { branch_name, location, contact_number } = req.body;

      // Check if branch already exists
      const existingBranch = await Branch.findOne({ where: { branch_name } });
      if (existingBranch) {
        return res.status(400).json({ success: false, message: 'Branch name already exists' });
      }

      // Create new branch
      const newBranch = await Branch.create({
        branch_name,
        location: location || null,
        contact_number: contact_number || null,
      });

      res.status(201).json({ success: true, message: 'Branch created successfully', branch: newBranch });
    } catch (error) {
      console.error('Error creating branch:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating branch',
        error: error.message,
      });
    }
  }

  // Find branch by ID
  async findBranchById(req, res) {
    try {
      const { id } = req.params;

      const branch = await Branch.findByPk(id);

      if (!branch) {
        return res.status(404).json({ success: false, message: 'Branch not found' });
      }

      res.status(200).json({ success: true, branch });
    } catch (error) {
      console.error('Error fetching branch:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }
}

module.exports = new BranchController();