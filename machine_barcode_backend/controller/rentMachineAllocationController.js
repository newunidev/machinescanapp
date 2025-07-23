const RentMachineAllocation = require('../model/rent_machine_allocation');
const RentMachine = require('../model/rent_machine');

class RentMachineAllocationController {
  // Create a new allocation
  async createAllocation(req, res) {
    try {
      const data = req.body;

      // Attempt to create the allocation
      const newAllocation = await RentMachineAllocation.create(data);

      res.status(201).json({
        success: true,
        message: 'Rent machine allocation created successfully',
        allocation: newAllocation,
      });
    } catch (error) {
      console.error('Error creating allocation:', error);

      // Check for validation or active-duplication error
      if (
        error.name === 'SequelizeValidationError' ||
        error.message.includes('active allocation already exists')
      ) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Get all allocations with RentMachine info
  async getAllAllocations(req, res) {
    try {
      const allocations = await RentMachineAllocation.findAll({
        include: {
          model: RentMachine,
          attributes: ['rent_item_id', 'serial_no', 'name', 'rented_by', 'brand'],
        },
        order: [['createdAt', 'DESC']],
      });

      res.status(200).json({
        success: true,
        message: 'Allocations retrieved successfully',
        allocations,
      });
    } catch (error) {
      console.error('Error retrieving allocations:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
}

module.exports = new RentMachineAllocationController();
