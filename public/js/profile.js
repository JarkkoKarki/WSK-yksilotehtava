document.addEventListener('DOMContentLoaded', () => {
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');
  const favoriteRestaurantSelect = document.getElementById(
    'favorite-restaurant'
  );
  const favoriteDisplay = document.getElementById('favorite-display');

  if (!token) {
    alert('Sinun täytyy kirjautua sisään!');
    window.location.href = 'login.html';
    return;
  }

  document.getElementById('username').textContent = username;

  const savedFavorite = localStorage.getItem('favoriteRestaurant');
  if (savedFavorite) {
    favoriteRestaurantSelect.value = savedFavorite;
    favoriteDisplay.textContent = `Suosikkiravintolasi on: ${savedFavorite}`;
  }

  document
    .getElementById('update-profile-form')
    .addEventListener('submit', (event) => {
      event.preventDefault();

      const selectedRestaurant = favoriteRestaurantSelect.value;
      localStorage.setItem('favoriteRestaurant', selectedRestaurant);

      favoriteDisplay.textContent = `Suosikkiravintolasi on: ${selectedRestaurant}`;

      alert('Profiili päivitetty onnistuneesti!');
    });

  const logoutButton = document.querySelector('.logout');
  logoutButton.addEventListener('click', logout);
});

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  alert('Kirjauduttu ulos onnistuneesti!');
  window.location.href = 'login.html';
}
