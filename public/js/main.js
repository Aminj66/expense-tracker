const token = localStorage.getItem('token');

// Redirect to login page if token is not present
if (!token) {
  window.location.href = '/login.html';
}

// Logout button functionality
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = '/login.html';
});

// Add new expense
const expenseForm = document.getElementById('expenseForm');
expenseForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const amount = document.getElementById('amount').value;
  const category = document.getElementById('category').value;
  const description = document.getElementById('description').value;

  const response = await fetch('/api/expenses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ amount, category, description })
  });

  if (response.ok) {
    loadExpenses();
  } else {
    alert('Error adding expense');
  }
});

// Fetch and display expenses
const loadExpenses = async () => {
  const response = await fetch('/api/expenses', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const expenses = await response.json();
  const expenseList = document.getElementById('expenseList');
  expenseList.innerHTML = '';

  expenses.forEach(expense => {
    const expenseItem = document.createElement('div');
    expenseItem.classList.add('expense-item');
    expenseItem.innerHTML = `
      <span>${expense.category}: $${expense.amount}</span>
      <button onclick="deleteExpense('${expense._id}')">Delete</button>
    `;
    expenseList.appendChild(expenseItem);
  });
};

// Delete an expense
const deleteExpense = async (id) => {
  const response = await fetch(`/api/expenses/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (response.ok) {
    loadExpenses();
  } else {
    alert('Error deleting expense');
  }
};

// Load expenses on page load
loadExpenses();

