const EmployeePermission = require('../model/employee_permission');
const Employee = require('../model/employee');
const Permission = require('../model/permission');

class EmployeePermissionController {
  // Create a new EmployeePermission entry
  static async createEmployeePermission(req, res) {
    try {
      const { employee_id, perm_id } = req.body;

      // Check if employee exists
      const employee = await Employee.findByPk(employee_id);
      if (!employee) {
        return res.status(404).json({ success: false, message: 'Employee not found' });
      }

      // Check if permission exists
      const permission = await Permission.findByPk(perm_id);
      if (!permission) {
        return res.status(404).json({ success: false, message: 'Permission not found' });
      }

      // Create EmployeePermission entry
      const newEmpPermission = await EmployeePermission.create({ employee_id, perm_id });

      return res.status(201).json({
        success: true,
        message: 'Employee Permission created successfully',
        data: newEmpPermission
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  // Get all EmployeePermissions
  static async getAllEmployeePermissions(req, res) {
    try {
      const empPermissions = await EmployeePermission.findAll({
        include: [
          { model: Employee, attributes: ['employee_id', 'name', 'email'] },
          { model: Permission, attributes: ['Perm_id', 'Permission'] }
        ]
      });

      return res.status(200).json({ success: true, data: empPermissions });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  // Get EmployeePermission by EMPPID
  static async getEmployeePermissionsByEmployeeId(req, res) {
    try {
        const { employee_id } = req.query;

        if (!employee_id) {
            return res.status(400).json({ success: false, message: 'Employee ID is required' });
        }

        const empPermissions = await EmployeePermission.findAll({
            where: { employee_id },
            include: [
                { model: Employee, attributes: ['employee_id', 'name', 'email', 'branch', 'designation'] },
                { model: Permission, attributes: ['Perm_id', 'Permission'] }
            ]
        });

        if (!empPermissions || empPermissions.length === 0) {
            return res.status(200).json({ success: false, message: 'No permissions found for this employee' });
        }

        return res.status(200).json({ success: true, data: empPermissions });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  // Delete EmployeePermission
  static async deleteEmployeePermission(req, res) {
    try {
      const { empPid } = req.params;

      const deletedRows = await EmployeePermission.destroy({ where: { EMPPID: empPid } });

      if (!deletedRows) {
        return res.status(404).json({ success: false, message: 'Employee Permission not found' });
      }

      return res.status(200).json({ success: true, message: 'Employee Permission deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}

module.exports = EmployeePermissionController;
