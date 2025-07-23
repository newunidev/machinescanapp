const RentMachine_Return = require('../model/rent_machine_return');
const RentMachine = require('../model/rent_machine'); // To include relation if needed

// Create RentMachine Return
const createRentMachineReturn = async (req, res) => {
  try {
    const { rent_item_id, return_date, Additional1, Additional2 } = req.body;

    if (!rent_item_id || !return_date) {
      return res.status(400).json({
        success: false,
        message: 'rent_item_id and return_date are required',
      });
    }

    const returnEntry = await RentMachine_Return.create({
      rent_item_id,
      return_date,
      Additional1,
      Additional2,
    });

    res.status(201).json({
      success: true,
      message: 'Return record created successfully',
      return: returnEntry,
    });
  } catch (error) {
    console.error('Error creating return:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating return',
      error: error.message,
    });
  }
};

// Get all RentMachine Returns
const getAllRentMachineReturns = async (req, res) => {
  try {
    const returns = await RentMachine_Return.findAll({
      include: [{ model: RentMachine, as: 'RentMachine' }],
    });

    res.status(200).json({
      success: true,
      returns,
    });
  } catch (error) {
    console.error('Error fetching returns:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching return records',
      error: error.message,
    });
  }
};

// Get RentMachine Return by ID
const getRentMachineReturnById = async (req, res) => {
  try {
    const { id } = req.params;
    const returnRecord = await RentMachine_Return.findByPk(id, {
      include: [{ model: RentMachine, as: 'RentMachine' }],
    });

    if (!returnRecord) {
      return res.status(404).json({
        success: false,
        message: 'Return record not found',
      });
    }

    res.status(200).json({
      success: true,
      return: returnRecord,
    });
  } catch (error) {
    console.error('Error fetching return by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching return by ID',
      error: error.message,
    });
  }
};

module.exports = {
  createRentMachineReturn,
  getAllRentMachineReturns,
  getRentMachineReturnById,
};
