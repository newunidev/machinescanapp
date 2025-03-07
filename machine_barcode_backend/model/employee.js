const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // Adjust the path as per your setup
const bcrypt = require('bcrypt'); // For password hashing

const Employee = sequelize.define('Employee', {
  employee_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true, // Ensures the email is valid
    },
  },
  branch: { // Replacing branch_id with a simple string field
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  contact: {
    type: DataTypes.STRING(15), // Adjust length based on your contact number format
    allowNull: false,
    validate: {
      isNumeric: true, // Ensures only numeric values are entered
      len: [10, 15], // Adjust based on minimum and maximum length
    },
  },
  designation: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  tableName: 'employees', // Name of the table in the database
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
  timestamps: true, // Adds createdAt and updatedAt fields
});

// Hook to hash the password before saving it
Employee.beforeCreate(async (employee, options) => {
  if (employee.password) {
    const salt = await bcrypt.genSalt(10);
    employee.password = await bcrypt.hash(employee.password, salt);
  }
});

Employee.beforeUpdate(async (employee, options) => {
  if (employee.password) {
    const salt = await bcrypt.genSalt(10);
    employee.password = await bcrypt.hash(employee.password, salt);
  }
});

module.exports = Employee;
