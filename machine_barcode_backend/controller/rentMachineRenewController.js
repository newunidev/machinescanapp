const RentMachine_Renew = require('../model/rent_machine_renew');
const RentMachine = require('../model/rent_machine'); // If you want to include machine details

// Create RentMachine Renew
const createRentMachineRenew = async (req, res) => {
  try {
    const { rent_item_id, renew_date, Additional1, Additional2 } = req.body;

    if (!rent_item_id || !renew_date) {
      return res.status(400).json({
        success: false,
        message: 'rent_item_id and renew_date are required',
      });
    }

    const renewEntry = await RentMachine_Renew.create({
      rent_item_id,
      renew_date,
      Additional1,
      Additional2,
    });

    res.status(201).json({
      success: true,
      message: 'Renew record created successfully',
      renew: renewEntry,
    });
  } catch (error) {
    console.error('Error creating renew:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating renew',
      error: error.message,
    });
  }
};

// Get all RentMachine Renewals
const getAllRentMachineRenews = async (req, res) => {
  try {
    const renews = await RentMachine_Renew.findAll({
      include: [{ model: RentMachine, as: 'RentMachine' }],
    });

    res.status(200).json({
      success: true,
      renews,
    });
  } catch (error) {
    console.error('Error fetching renews:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching renew records',
      error: error.message,
    });
  }
};

// Get RentMachine Renew by ID
const getRentMachineRenewById = async (req, res) => {
  try {
    const { id } = req.params;
    const renewRecord = await RentMachine_Renew.findByPk(id, {
      include: [{ model: RentMachine, as: 'RentMachine' }],
    });

    if (!renewRecord) {
      return res.status(404).json({
        success: false,
        message: 'Renew record not found',
      });
    }

    res.status(200).json({
      success: true,
      renew: renewRecord,
    });
  } catch (error) {
    console.error('Error fetching renew by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching renew by ID',
      error: error.message,
    });
  }
};

module.exports = {
  createRentMachineRenew,
  getAllRentMachineRenews,
  getRentMachineRenewById,
};
