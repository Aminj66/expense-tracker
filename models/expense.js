const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

// Define Expense model
const Expense = sequelize.define('Expense', {
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: Data.now,
  },
});

// Associate expenses with users
Expense.belongsTo(User, { foreignKey: 'userId' });

module.exports = Expense;

