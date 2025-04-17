import {favoriteUrl} from '../utils/variables.js';

export const RestaurantRow = ({name, address, city, _id}, tr, favorites) => {
  const createCell = (text) => {
    const td = document.createElement('td');
    td.innerText = text;
    return td;
  };

  const nameTd = createCell(name);
  const addressTd = createCell(address);
  const cityTd = createCell(city);
  const favoriteTd = document.createElement('td');

  const favoriteButton = document.createElement('button');
  favoriteButton.className = 'favorite-button';
  favoriteButton.innerText = favorites.some((fav) => fav.restaurant_id === _id)
    ? 'Poista suosikeista'
    : 'Lisää suosikiksi';

  favoriteButton.addEventListener('click', async (event) => {
    event.stopPropagation();
    try {
      const userId = localStorage.getItem('id');
      const isFavorite = favorites.some((fav) => fav.restaurant_id === _id);
      if (!userId) {
        alert('Kirjaudu sisään lisätäksesi ravintola suosikkeihin');
        favoriteButton.innerText = 'Lisää suosikiksi';
        document.location.href = 'index.html';
      }

      if (isFavorite) {
        await fetch(`${favoriteUrl}/`, {
          method: 'DELETE',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({user_id: userId, restaurant_id: _id}),
        });
        favoriteButton.innerText = 'Lisää suosikiksi';
      } else {
        await fetch(`${favoriteUrl}/`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({user_id: userId, restaurant_id: _id}),
        });
        favoriteButton.innerText = 'Poista suosikeista';
      }

      const res = await fetch(`${favoriteUrl}/${userId}`);
      favorites = await res.json();
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  });

  favoriteTd.appendChild(favoriteButton);
  tr.append(nameTd, addressTd, cityTd, favoriteTd);
};
