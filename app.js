const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');

dotenv.config();

const app = express();
app.use(express.json());

// Connect to the database
connectDB();

// Define routes
app.use('/api/users', userRoutes);
app.use('/api/expenses', expenseRoutes);

app.get('/', (req, res) => {
  res.send('Expense Tracker API');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const path = require('path');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Define routes
app.use('/api/users', userRoutes);
app.use('/api/expenses', expenseRoutes);

// Catch-all route to serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

