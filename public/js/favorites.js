import {getWeeklyMenu} from './utils/menu.js';
import {logoutUser} from './components/logout.js';
import {fetchData} from '../../lib/fetchdata.js';
import {apiUrlRestaurant} from './variables.js';
import {fetchFavorites} from './api/fetchFavorites.js';

export let favoritesAll = {};

document.addEventListener('DOMContentLoaded', async () => {
  const favoritesList = document.getElementById('favorites-list');
  const menuModal = document.getElementById('menu-modal');
  const userId = localStorage.getItem('id');
  const token = localStorage.getItem('token');

  if (!token || !userId) {
    alert('Sinun täytyy kirjautua sisään!');
    window.location.href = 'login.html';
    return;
  }
  const favorites = await fetchFavorites();
  const allRestaurants = await fetchData(`${apiUrlRestaurant}/restaurants`);

  favorites.forEach((favorite) => {
    const restaurant = allRestaurants.find(
      (r) => r._id === favorite.restaurant_id
    );

    if (!restaurant) {
      console.warn(`Restaurant with ID ${favorite.restaurant_id} not found.`);
      return;
    }

    const listItem = document.createElement('li');
    listItem.classList.add('favorite-item');
    listItem.textContent = restaurant.name;

    listItem.addEventListener('click', async () => {
      menuModal.innerHTML = '<p>Ladataan ruokalistaa...</p>';
      menuModal.showModal();

      try {
        const weeklyMenu = await getWeeklyMenu(restaurant._id, 'fi');

        if (!weeklyMenu || weeklyMenu.length === 0) {
          menuModal.innerHTML = '<p>Ei ruokalistaa saatavilla.</p>';
          return;
        }

        let menuHtml = `<h2>${restaurant.name}</h2>`;
        weeklyMenu.forEach((day, index) => {
          menuHtml += `<h3>${weeklyMenu[index].date}</h3>`;
          day.courses.forEach((course) => {
            menuHtml += `<p>${course.name} - ${
              course.price || 'Ei hintatietoa'
            }</p>`;
          });
        });

        menuModal.innerHTML = menuHtml;

        const closeButton = document.createElement('button');
        closeButton.textContent = 'Sulje';
        closeButton.id = 'modal';
        closeButton.style.backgroundColor = '#ff6f61';
        closeButton.addEventListener('click', () => menuModal.close());
        menuModal.appendChild(closeButton);
      } catch (error) {
        console.error('Virhe ruokalistan lataamisessa:', error);
        menuModal.innerHTML = '<p>Virhe ruokalistan lataamisessa.</p>';
      }
    });

    favoritesList.appendChild(listItem);
  });

  const logoutButton = document.querySelector('.logout');
  logoutButton.addEventListener('click', async () => {
    await logoutUser();
    window.location.href = 'login.html';
  });
});
