const Supplier = require('../model/supplier'); // Adjust the path if needed

class SupplierController {
  // Create a new Supplier
  async createSupplier(req, res) {
    try {
      const { name, address, contact } = req.body;

      const newSupplier = await Supplier.create({
        name,
        address,
        contact,
      });

      res.status(200).json({
        success: true,
        message: 'Supplier created successfully',
        supplierCreated: newSupplier,
      });
    } catch (error) {
      console.error('Error creating supplier:', error);

      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Get all Suppliers
  async getAllSuppliers(req, res) {
    try {
      const suppliers = await Supplier.findAll({
        attributes: ['supplier_id', 'name', 'address', 'contact'],
      });

      res.status(200).json({
        success: true,
        message: 'Suppliers retrieved successfully',
        suppliers: suppliers,
      });
    } catch (error) {
      console.error('Error retrieving suppliers:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Get Supplier by ID
  async getSupplierById(req, res) {
    try {
      const { id } = req.params;

      const supplier = await Supplier.findByPk(id, {
        attributes: ['supplier_id', 'name', 'address', 'contact'],
      });

      if (!supplier) {
        return res.status(404).json({
          success: false,
          message: `No supplier found with ID: ${id}`,
        });
      }

      res.status(200).json({
        success: true,
        message: 'Supplier retrieved successfully',
        supplier: supplier,
      });
    } catch (error) {
      console.error('Error retrieving supplier by ID:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
}

module.exports = new SupplierController();
