import {getDailyMenu, getWeeklyMenu} from '../utils/menu.js';
import {
  menuHtml,
  menuWeekHtml,
  chooseDayModal,
  createErrorHtml,
} from '../html.js';
import {restaurantModal} from './restaurantModal.js';
import {RestaurantRow} from './restaurantRow.js';

export const createTable = async (restaurants, modal, taulukko) => {
  console.log('Restaurants for Table:', restaurants);
  taulukko.innerHTML = '';

  if (!restaurants.length) {
    const noData = document.createElement('p');
    noData.innerText = 'No restaurants found.';
    taulukko.append(noData);
    return;
  }

  let favorites = [];
  try {
    const res = await fetch(
      `http://10.120.32.93/app/api/v1/favorites/${localStorage.getItem('id')}`
    );
    favorites = await res.json();
  } catch (e) {
    console.error('Favorites fetch error:', e);
  }
  restaurants.forEach((r) => {
    const tr = document.createElement('tr');
    RestaurantRow(r, tr, favorites);
    taulukko.appendChild(tr);

    tr.addEventListener('click', async () => {
      modal.innerHTML = '';
      modal.showModal();

      try {
        const weeklyMenu = await getWeeklyMenu(r._id, 'fi');

        if (!weeklyMenu || weeklyMenu.length === 0) {
          console.error('No menu data available for this restaurant.');
          modal.innerHTML = '<p>No menu available for this week.</p>';
          return;
        }

        const buttonsContainer = document.createElement('div');
        buttonsContainer.classList.add('buttons-container');

        const weekButton = document.createElement('button');
        weekButton.classList.add('day');
        weekButton.value = 'week';
        weekButton.innerText = 'Show Full Week';
        buttonsContainer.appendChild(weekButton);

        weeklyMenu.forEach((day, index) => {
          if (day.courses && day.courses.length > 0) {
            const button = document.createElement('button');
            button.classList.add('day');
            button.value = index;
            button.innerText = day.date;
            buttonsContainer.appendChild(button);
          }
        });

        modal.appendChild(buttonsContainer);

        const buttons = modal.querySelectorAll('.day');
        buttons.forEach((btn) => {
          btn.addEventListener('click', async (e) => {
            e.preventDefault();
            modal.innerHTML = '';

            if (btn.value === 'week') {
              restaurantModal(r, modal);
              modal.insertAdjacentHTML('beforeend', menuWeekHtml(weeklyMenu));
            } else {
              const day = btn.value;
              const dailyMenu = await getDailyMenu(r._id, 'fi', day);

              if (!dailyMenu) {
                console.error('No courses available for the selected day.');
                modal.innerHTML =
                  '<p>No menu available for the selected day.</p>';
                return;
              }
              console.log('daily: ', dailyMenu);
              restaurantModal(r, modal);
              modal.insertAdjacentHTML(
                'beforeend',
                menuHtml(dailyMenu.courses)
              );
              console.log(modal);
            }
          });
        });
      } catch (error) {
        console.error('Error fetching menu data:', error.message);
        modal.innerHTML =
          '<p>Failed to load menu data. Please try again later.</p>';
      }
    });
  });
};
