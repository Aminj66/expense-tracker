const Expense = require('../models/Expense');

// Create an expense
exports.createExpense = async (req, res) => {
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
    res.status(500).json({ message: "Error occurred while creating expense", error });
  }
};

// Get all expenses for a user
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Error occurred while fetching expenses", error });
  }
};

// Update an expense
exports.updateExpense = async (req, res) => {
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
    res.status(500).json({ message: "Error occurred while updating expense", error });
  }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    if (expense.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await expense.deleteOne();
    res.status(200).json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ message: "Error occurred while deleting expense", error });
  }
};

