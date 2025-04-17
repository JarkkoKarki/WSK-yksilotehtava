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
  usernameDisplay.innerText = currentUsername;
  const profilePictureInput = document.getElementById('profile-picture');
  const profilePicturePreview = document.getElementById(
    'profile-picture-preview'
  );

  profilePictureInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        profilePicturePreview.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  document
    .getElementById('update-profile-form')
    .addEventListener('submit', async (event) => {
      event.preventDefault();

      const newUsername = document.getElementById('username-input').value;
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
  logoutButton.addEventListener('click', async () => {
    await logoutUser();
    window.location.href = 'login.html';
  });
});
