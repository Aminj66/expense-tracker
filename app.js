const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Load your API routes
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
app.use('/api/users', userRoutes);
app.use('/api/expenses', expenseRoutes);

// Define the port to use (Heroku, Vercel or local)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

