import {profilePictureUrl, usersUrl} from '../utils/variables.js';

export async function fetchPicture(formData) {
  try {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');

    const response = await fetch(`${usersUrl}/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.ok) {
      const responseData = await response.json();
      localStorage.removeItem('filename');
      localStorage.setItem('filename', responseData.updatedUser.thumbnailPath);
    } else {
      const errorData = await response.json();
      console.error('Error updating profile:', errorData);
      alert(`Virhe: ${errorData.message}`);
    }
  } catch (error) {
    console.error('Error during profile update:', error);
    alert('Tapahtui virhe. Yritä myöhemmin uudelleen.');
  }
}

export async function fetchPictureWithId(id) {
  try {
    const token = localStorage.getItem('token');
    const payload = JSON.parse(atob(token.split('.')[1]));

    const response = await fetch(`${usersUrl}/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error fetching profile picture:', errorData);
      alert(`Virhe: ${errorData.message}`);
      return;
    }

    const responseData = await response.json();
    const filePath = responseData.filename;
    localStorage.setItem('filename', filePath);
  } catch (error) {
    console.error('Virhe profiilin päivityksessä:', error);
    alert('Tapahtui virhe. Yritä myöhemmin uudelleen.');
  }
}

export const loadProfilePicture = () => {
  const profilePictureElement = document.getElementById('profile-picture');
  const token = localStorage.getItem('token');
  const filename = localStorage.getItem('filename');

  if (token && filename && profilePictureElement) {
    fetch(`${profilePictureUrl}/${filename}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => (res.ok ? res.blob() : Promise.reject('not found')))
      .then((blob) => {
        profilePictureElement.src = URL.createObjectURL(blob);
      })
      .catch(() => {
        profilePictureElement.src = './images/default-profile.png';
      });
  } else if (profilePictureElement) {
    profilePictureElement.src = './images/default-profile.png';
  }
};
