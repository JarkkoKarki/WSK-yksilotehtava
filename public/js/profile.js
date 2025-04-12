import {fetchPicture} from '../js/fetchPicture.js';

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const usernameDisplay = document.getElementById('username');

  if (!token) {
    alert('Sinun täytyy kirjautua sisään!');
    window.location.href = 'login.html';
    return;
  }

  const currentUsername = localStorage.getItem('username');
  usernameDisplay.textContent = currentUsername;
  document
    .getElementById('update-profile-form')
    .addEventListener('submit', async (event) => {
      event.preventDefault();

      const newUsername = document.getElementById('username').textContent;
      const profilePicture =
        document.getElementById('profile-picture').files[0];

      const formData = new FormData();
      formData.append('username', newUsername);
      if (profilePicture) {
        formData.append('profilePicture', profilePicture);
      }
      localStorage.setItem('username', newUsername);
      await fetchPicture(formData);
      window.location.href = 'index.html';
    });

  // Logout functionality
  const logoutButton = document.querySelector('.logout');
  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('favoriteRestaurant');
    alert('Kirjauduttu ulos onnistuneesti!');
    window.location.href = 'login.html';
  });
});
