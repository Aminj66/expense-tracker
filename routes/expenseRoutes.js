const express = require('express');
const Expense = require('../models/Expense');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware to verify the JWT
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Create an expense
router.post('/', authenticateToken, async (req, res) => {
  const { amount, category, description } = req.body;
  
  try {
    const newExpense = new Expense({
      userId: req.user.id,
      amount,
      category,
      description,
    });

    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all expenses for a user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update an expense
router.put('/:id', authenticateToken, async (req, res) => {
  const { amount, category, description } = req.body;

  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    if (expense.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    expense.amount = amount || expense.amount;
    expense.category = category || expense.category;
    expense.description = description || expense.description;

    const updatedExpense = await expense.save();
    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete an expense
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    if (expense.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await expense.deleteOne();
    res.status(200).json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

