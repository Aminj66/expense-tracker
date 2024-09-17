const sequelize = require('./config/db');

// Sync database
sequelize.sync().then(() => {
  console.log('Database synced');
}).catch((error) => {
  console.log('Error syncing database', error);
});

