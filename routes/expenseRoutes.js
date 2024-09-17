const express = require('express');
const { createExpense, getExpenses, updateExpense, deleteExpense } = require('../controllers/expenseController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const router = express.Router();

// Create an expense
router.post('/', authenticateToken, createExpense);

// Get all expenses
router.get('/', authenticateToken, getExpenses);

// Update an expense
router.put('/:id', authenticateToken, updateExpense);

// Delete an expense
router.delete('/:id', authenticateToken, deleteExpense);

module.exports = router;

