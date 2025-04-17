import {fetchPicture} from '../api/fetchPicture.js';
import {fetchName, putUser} from '../api/fetchUser.js';
import {logoutUser} from '../components/logout.js';

document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const usernameDisplay = document.getElementById('username');

  if (!token) {
    alert('Sinun täytyy kirjautua sisään!');
    window.location.href = 'login.html';
    return;
  }

  const name = await fetchName();
  usernameDisplay.innerText = name.name;
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
  const h1 = document.querySelector('h1');
  h1.addEventListener('click', () => {
    window.location.href = 'index.html';
  });
  document
    .getElementById('update-profile-form')
    .addEventListener('submit', async (event) => {
      event.preventDefault();

      const newUsername = document.getElementById('username-input').value;
      const profilePicture =
        document.getElementById('profile-picture').files[0];
      const newEmail = document.getElementById('email-input').value;
      const newName = document.getElementById('name-input').value;

      const formData = new FormData();
      if (newUsername) {
        formData.append('username', newUsername);
      }
      if (newName) {
        formData.append('name', newName);
      }
      if (newEmail) {
        formData.append('email', newEmail);
      }

      if (profilePicture) {
        formData.append('profilePicture', profilePicture);
      }

      try {
        await putUser(formData);
        window.location.href = 'index.html';
      } catch (error) {
        console.error('Error during profile update:', error);
      }
    });
});
