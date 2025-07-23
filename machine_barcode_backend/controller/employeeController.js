const Employee = require('../model/employee.js'); // Adjust the path as necessary
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//const SECRET_KEY = 'NUIT';
require('dotenv').config(); // Load environment variables
const SECRET_KEY = process.env.JWT_SECRET;

class EmployeeController {
  // Method to create a new employee
  async createEmployee(req, res) {
    try {
      const { name, email, branch, address, contact, designation, password } = req.body;

      // Check if an employee with the given email already exists
      const existingEmployee = await Employee.findOne({ where: { email } });
      if (existingEmployee) {
        return res.status(400).json({
          success: false,
          message: 'Employee with this email already exists.',
        });
      }

      // Create a new employee
      const newEmployee = await Employee.create({
        name,
        email,
        branch, // Use the branch field directly as a string
        address,
        contact,
        designation,
        password, // Password will be hashed in the beforeCreate hook
      });

      res.status(201).json({
        success: true,
        message: 'Employee created successfully.',
        employee: newEmployee,
      });
    } catch (error) {
      console.error('Error creating employee:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error.',
      });
    }
  }

  // Method to retrieve all employees
  async getAllEmployees(req, res) {
    try {
      const employees = await Employee.findAll();

      res.status(200).json({
        success: true,
        message: 'Employees retrieved successfully.',
        employees: employees,
      });
    } catch (error) {
      console.error('Error retrieving employees:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error.',
      });
    }
  }

  // Method to get an employee by ID
  async getEmployeeById(req, res) {
    try {
      const { id } = req.params;

      const employee = await Employee.findByPk(id);
      if (!employee) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found.',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Employee retrieved successfully.',
        employee: employee,
      });
    } catch (error) {
      console.error('Error retrieving employee:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error.',
      });
    }
  }

  // Method to update an employee by ID
  async updateEmployee(req, res) {
    try {
      const { id } = req.params;
      const { name, email, branch, address, contact, designation, password } = req.body;

      // Find the employee by ID
      const employee = await Employee.findByPk(id);
      if (!employee) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found.',
        });
      }

      // Update the employee data
      if (name) employee.name = name;
      if (email) employee.email = email;
      if (branch) employee.branch = branch;
      if (address) employee.address = address;
      if (contact) employee.contact = contact;
      if (designation) employee.designation = designation;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        employee.password = await bcrypt.hash(password, salt);
      }

      // Save the updated employee
      await employee.save();

      res.status(200).json({
        success: true,
        message: 'Employee updated successfully.',
        employee: employee,
      });
    } catch (error) {
      console.error('Error updating employee:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error.',
      });
    }
  }

  // Method to delete an employee by ID
  async deleteEmployee(req, res) {
    try {
      const { id } = req.params;

      const employee = await Employee.findByPk(id);
      if (!employee) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found.',
        });
      }

      // Delete the employee
      await employee.destroy();

      res.status(200).json({
        success: true,
        message: 'Employee deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting employee:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error.',
      });
    }
  }

  async login(req, res) {
    const { email, password } = req.query;
    
    try {
      // Check if the user exists
      const employee = await Employee.findOne({ where: { email } });
  
      if (!employee) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found.',
        });
      }
      console.log(`Stored Hashed Password: ${employee.password}`); // Log stored password
  
      // Validate the password
      const isPasswordValid = await bcrypt.compare(password, employee.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.',
        });
      }
  
      // Generate JWT token
      const token = jwt.sign(
        { employeeId: employee.employee_id, email: employee.email },
        SECRET_KEY,
        { expiresIn: '1h' }
      );
  
      // Return success response with user details
      return res.status(200).json({
        success: true,
        message: 'Login successful.',
        token,
        user: {
          email: employee.email,
          branch: employee.branch,
          employee_id:employee.employee_id,
          name:employee.name, // Assuming 'branch' is a direct column in the Employee table
        },
      });
    } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred during login.',
        error: error.message,
      });
    }
  }

  async updatePasswordByEmail(req, res) {
    try {
      const { email, newPassword } = req.body;
  
      // Check if the employee exists
      const employee = await Employee.findOne({ where: { email } });
  
      if (!employee) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found.',
        });
      }
  
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
  
      console.log(`New Hashed Password: ${hashedPassword}`); // Log hashed password
  
      // Update the password
      employee.password = hashedPassword;
      await employee.save();
  
      res.status(200).json({
        success: true,
        message: 'Password updated successfully.',
      });
    } catch (error) {
      console.error('Error updating password:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error.',
      });
    }
  }
  
  
}

module.exports = new EmployeeController();
