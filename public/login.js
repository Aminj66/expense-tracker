document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token);
      alert('Login successful');
      window.location.href = '/index.html';  // Redirect to the homepage after login
    } else {
      alert('Login failed. Please check your credentials.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while logging in.');
  }
});

