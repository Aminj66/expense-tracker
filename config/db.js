const { Sequelize } = require('sequelize');
const path = require('path');

// Create a SQLite database stored in the 'database.sqlite' file
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
});

module.exports = sequelize;

