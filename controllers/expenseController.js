const Expense = require('../models/Expense');

// Create an expense
exports.createExpense = async (req, res) => {
  const { amount, category, description } = req.body;

  try {
    const newExpense = await Expense.create({
      amount,
      category,
      description,
      userId: req.user.id,
    });

    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ message: "Error occurred while creating expense", error });
  }
};

// Get all expenses for a user
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({ where: { userId: req.user.id } });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Error occurred while fetching expenses", error });
  }
};

// Update an expense
exports.updateExpense = async (req, res) => {
  const { amount, category, description } = req.body;

  try {
    const expense = await Expense.findByPk(req.params.id);
    if (!expense || expense.userId !== req.user.id) {
      return res.status(404).json({ message: "Expense not found or unauthorized" });
    }

    expense.amount = amount || expense.amount;
    expense.category = category || expense.category;
    expense.description = description || expense.description;

    await expense.save();
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Error occurred while updating expense", error });
  }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id);
    if (!expense || expense.userId !== req.user.id) {
      return res.status(404).json({ message: "Expense not found or unauthorized" });
    }

    await expense.destroy();
    res.status(200).json({ message: "Expense deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error occurred while deleting expense", error });
  }
};

