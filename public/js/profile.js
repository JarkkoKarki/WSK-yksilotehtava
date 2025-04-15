import {fetchPicture} from '../js/api/fetchPicture.js';
import {logoutUser} from './components/logout.js';

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const usernameDisplay = document.getElementById('username');

  if (!token) {
    alert('Sinun täytyy kirjautua sisään!');
    window.location.href = 'login.html';
    return;
  }

  const currentUsername = localStorage.getItem('username');
  usernameDisplay.value = currentUsername;
  document
    .getElementById('update-profile-form')
    .addEventListener('submit', async (event) => {
      event.preventDefault();

      const newUsername = document.getElementById('username').value;
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

  const logoutButton = document.querySelector('.logout');
  logoutButton.addEventListener('click', () => {
    logoutUser();
    window.location.href = 'login.html';
  });
});
