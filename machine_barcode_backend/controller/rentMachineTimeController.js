const RentMachineTime = require('../model/rent_machine_time');
const RentMachine = require('../model/rent_machine');
const RentMachineRenew = require('../model/rent_machine_renew');
const RentMachineReturn = require('../model/rent_machine_return');

// Create RentMachineTime
const createRentMachineTime = async (req, res) => {
  try {
    const {
      rent_item_id,
      from_date,
      to_date,
      Returned = false,
      Return_id = null,
      Renewed = false,
      Renew_id = null,
      po_no,
    } = req.body;

    // Business Rule: Returned and Renewed can't both be true
    if (Returned && Renewed) {
      return res.status(400).json({
        success: false,
        message: "Returned and Renewed cannot both be true at the same time.",
      });
    }

    if (new Date(from_date) > new Date(to_date)) {
      return res.status(400).json({
        success: false,
        message: "From date cannot be after To date.",
      });
    }

    if (Returned && !Return_id) {
      return res.status(400).json({
        success: false,
        message: "Return_id must be provided when Returned is true.",
      });
    }

    if (Renewed && !Renew_id) {
      return res.status(400).json({
        success: false,
        message: "Renew_id must be provided when Renewed is true.",
      });
    }

    const rentTime = await RentMachineTime.create({
      rent_item_id,
      from_date,
      to_date,
      Returned,
      Return_id,
      Renewed,
      Renew_id,
      po_no,
    });

    return res.status(201).json({
      success: true,
      message: "RentMachineTime record created successfully",
      data: rentTime,
    });
  } catch (error) {
    //console.error("Error creating RentMachineTime:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create RentMachineTime record",
      error: error.message,
    });
  }
};

// Get all RentMachineTime records
const getAllRentMachineTimes = async (req, res) => {
  try {
    const records = await RentMachineTime.findAll({
      include: [
        { model: RentMachine },
        { model: RentMachineReturn },
        { model: RentMachineRenew },
      ],
    });

    return res.status(200).json({
      success: true,
      data: records,
    });
  } catch (error) {
    console.error("Error fetching RentMachineTime records:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch records",
      error: error.message,
    });
  }
};

// Get RentMachineTime by ID
const getRentMachineTimeById = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await RentMachineTime.findByPk(id, {
      include: [
        { model: RentMachine },
        { model: RentMachineReturn },
        { model: RentMachineRenew },
      ],
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    console.error("Error retrieving RentMachineTime record:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving record",
      error: error.message,
    });
  }
};

// Update RentMachineTime
const updateRentMachineTime = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      Returned,
      Return_id,
      Renewed,
      Renew_id,
      from_date,
      to_date,
      ...otherUpdates
    } = req.body;

    const rentTime = await RentMachineTime.findByPk(id);
    if (!rentTime) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    if (Returned && Renewed) {
      return res.status(400).json({
        success: false,
        message: "Returned and Renewed cannot both be true.",
      });
    }

    if (from_date && to_date && new Date(from_date) > new Date(to_date)) {
      return res.status(400).json({
        success: false,
        message: "From date cannot be after To date.",
      });
    }

    await rentTime.update({
      ...otherUpdates,
      from_date: from_date || rentTime.from_date,
      to_date: to_date || rentTime.to_date,
      Returned: Returned !== undefined ? Returned : rentTime.Returned,
      Return_id: Returned ? Return_id : null,
      Renewed: Renewed !== undefined ? Renewed : rentTime.Renewed,
      Renew_id: Renewed ? Renew_id : null,
    });

    return res.status(200).json({
      success: true,
      message: "RentMachineTime updated successfully",
      data: rentTime,
    });
  } catch (error) {
    console.error("Error updating RentMachineTime:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update RentMachineTime record",
      error: error.message,
    });
  }
};

module.exports = {
  createRentMachineTime,
  getAllRentMachineTimes,
  getRentMachineTimeById,
  updateRentMachineTime,
};
