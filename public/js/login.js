import {loadProfilePicture} from './api/fetchPicture.js';
import {logoutUser} from './components/logout.js';
import {fetchPictureWithId} from './api/fetchPicture.js';
import {loginUrl} from './variables.js';

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const loginContainer = document.querySelector('.login');
  const loginForm = document.getElementById('login-form');
  const guestButton = document.getElementById('guest-button');

  if (guestButton) {
    guestButton.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  } else {
    console.warn('Guest button not found in the DOM.');
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      try {
        const response = await fetch(loginUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({username, password}),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('token', data.token);
          localStorage.setItem('username', username);
          localStorage.setItem('id', data.user.user_id);
          await fetchPictureWithId(data.user.user_id);
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

  if (loginContainer) {
    if (token) {
      loginContainer.innerHTML = '';

      const favorites = document.createElement('a');
      favorites.href = 'favorites.html';
      favorites.textContent = 'Suosikit';
      favorites.classList.add('link');

      const profile = document.createElement('a');
      profile.href = 'profile.html';
      profile.textContent = 'Muokkaa Profiilia';
      profile.classList.add('link');

      const logout = document.createElement('a');
      logout.href = '#';
      logout.textContent = 'Kirjaudu ulos';
      logout.classList.add('link');
      loadProfilePicture();

      logout.addEventListener('click', async () => {
        await logoutUser();
        window.location.href = 'index.html';
      });
      loginContainer.appendChild(favorites);
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
