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

      const formData = new FormData();
      formData.append('name', newUsername);
      if (profilePicture) {
        formData.append('profilePicture', profilePicture);
      }

      console.log('FormData being sent:', [...formData.entries()]);

      try {
        console.log(await putUser(formData));
      } catch (error) {
        console.error('Error during profile update:', error);
      }
    });
});
