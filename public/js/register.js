document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('register-form');

  if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const username = document.getElementById('username').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirm-password').value;

      if (password !== confirmPassword) {
        alert('Salasanat eivät täsmää!');
        return;
      }

      const payload = {
        name: username,
        username: username,
        password: password,
        email: email,
        role: 'user',
      };

      try {
        const response = await fetch('http://10.120.32.80/app/api/v1/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          await response.json();
          window.location.href = 'login.html';
        }
      } catch (error) {
        console.error('Error during registration:', error);
        alert('Palvelimeen ei saatu yhteyttä.');
      }
    });
  }
  document.getElementById('guest-button').addEventListener('click', () => {
    window.location.href = 'index.html';
  });
});
