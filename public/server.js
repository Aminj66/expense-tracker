const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/expenseTracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);

// Secret key for JWT
const JWT_SECRET = 'your_secret_key';

// Register Route
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user
  const user = new User({ username, password: hashedPassword });
  await user.save();

  res.json({ message: 'User registered successfully' });
});

// Login Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Find the user in the database
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  // Check if the password matches
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  // Generate a JWT token
  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

  // Send the token in a cookie
  res.cookie('token', token, { httpOnly: true }).json({ message: 'Login successful' });
});

// Protected Route (Check if logged in)
app.get('/dashboard', (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ message: `Welcome, user with ID: ${decoded.userId}` });
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
});

// Logout Route
app.post('/logout', (req, res) => {
  res.clearCookie('token').json({ message: 'Logged out successfully' });
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
