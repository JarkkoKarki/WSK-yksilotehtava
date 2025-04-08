document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const loginContainer = document.querySelector('.login');
  const loginForm = document.getElementById('login-form');
  const guestButton = document.getElementById('guest-button');

  // Guest button
  if (guestButton) {
    guestButton.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  } else {
    console.warn('Guest button not found in the DOM.');
  }

  // Login form
  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      try {
        const response = await fetch(
          'http://10.120.32.80/app/api/v1/auth/login',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({username, password}),
          }
        );

        if (response.ok) {
          const data = await response.json();
          alert('Kirjautuminen onnistui!');
          localStorage.setItem('token', data.token);
          localStorage.setItem('username', username);
          window.location.href = 'index.html';
        } else {
          const error = await response.json();
          alert(`Virhe kirjautumisessa: ${error.message}`);
        }
      } catch (error) {
        console.error('Error during login:', error);
        alert('Palvelimeen ei saatu yhteyttä.');
      }
    });
  }

  // Logged-in
  if (loginContainer) {
    if (token) {
      loginContainer.innerHTML = '';

      const profile = document.createElement('a');
      profile.href = 'profile.html';
      profile.textContent = 'Muokkaa Profiilia';
      profile.classList.add('link');

      const logout = document.createElement('a');
      logout.href = '#';
      logout.textContent = 'Kirjaudu ulos';
      logout.classList.add('link');

      // Logout
      logout.addEventListener('click', async () => {
        try {
          const response = await fetch(
            'http://10.120.32.80/app/api/v1/auth/logout',
            {
              method: 'GET',
            }
          );

          if (response.ok) {
            alert('Kirjauduttu ulos onnistuneesti!');
          } else {
            const error = await response.json();
            alert(`Virhe uloskirjautumisessa: ${error.message}`);
          }
        } catch (error) {
          console.error('Error during logout:', error);
          alert('Palvelimeen ei saatu yhteyttä.');
        }

        // Clear localStorage and redirect
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.location.href = 'index.html';
      });

      loginContainer.appendChild(profile);
      loginContainer.appendChild(logout);
    } else {
      loginContainer.innerHTML = `
        <a href="login.html">Kirjaudu</a>
        <a href="register.html">Rekisteröidy</a>
      `;
    }
  }
});
