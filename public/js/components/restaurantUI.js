import {RestaurantRow} from './restaurantRow.js';
import {getWeeklyMenu, getDailyMenu} from '../utils/menu.js';
import {fetchAndDisplayRoute} from './routeOnMap.js';
import {getRoute} from '../api/route.js';
import {map} from '../components.js';
import {restaurantModal} from './restaurantModal.js';
import {menuHtml, menuWeekHtml} from '../html.js';
import {favoriteUrl} from '../variables.js';

export const createTable = async (restaurants, modal, taulukko, crd) => {
  if (!crd || !crd.latitude || !crd.longitude) {
    console.error('User coordinates are missing or invalid.');
    modal.innerHTML =
      '<p>Failed to load data. User location is unavailable.</p>';
    return;
  }
  taulukko.innerHTML = '';

  if (!restaurants.length) {
    const noData = document.createElement('p');
    noData.innerText = 'No restaurants found.';
    taulukko.append(noData);
    return;
  }

  if (!crd || !crd.latitude || !crd.longitude) {
    console.error('User coordinates are missing or invalid.');
    modal.innerHTML =
      '<p>Failed to load data. User location is unavailable.</p>';
    return;
  }

  let favorites = [];
  try {
    const res = await fetch(`${favoriteUrl}/${localStorage.getItem('id')}`);
    favorites = await res.json();
  } catch (e) {
    console.error('Favorites fetch error:', e);
  }

  restaurants.forEach((r) => {
    const tr = document.createElement('tr');
    RestaurantRow(r, tr, favorites);
    taulukko.appendChild(tr);

    tr.addEventListener('click', async () => {
      modal.innerHTML = '<p>Loading...</p>';
      modal.showModal();

      const addressSection = document.getElementById('address');

      try {
        const weeklyMenuPromise = getWeeklyMenu(r._id, 'fi');

        const userLat = crd.latitude;
        const userLng = crd.longitude;
        const [restaurantLng, restaurantLat] = r.location.coordinates;

        fetchAndDisplayRoute(
          map,
          userLat,
          userLng,
          restaurantLat,
          restaurantLng,
          'red'
        ).catch((error) => {
          console.error('Error displaying route on map:', error.message);
        });

        const weeklyMenu = await weeklyMenuPromise;

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

        modal.innerHTML = '';
        modal.appendChild(buttonsContainer);
        const buttons = modal.querySelectorAll('.day');
        buttons.forEach((btn) => {
          btn.addEventListener('click', async (e) => {
            e.preventDefault();
            modal.innerHTML = '<p>Loading...</p>';

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

              restaurantModal(r, modal);
              modal.insertAdjacentHTML(
                'beforeend',
                menuHtml(dailyMenu.courses)
              );
            }
          });
        });

        const routeData = await getRoute(
          userLat,
          userLng,
          restaurantLat,
          restaurantLng
        );
        const routeHtml = routeData.edges
          .map((edge, index) => {
            const {start, end, legs} = edge.node;
            const legsHtml = legs
              .map(
                (leg) => `
                <li>
                  Tapa: ${leg.mode}, Kesto: ${Math.round(
                  leg.duration / 60
                )} min,
                  Matka: ${leg.distance.toFixed(2)} m
                  <br />
                  Aloitus: ${new Date(
                    leg.start.scheduledTime
                  ).toLocaleTimeString()},
                  Lopetus: ${new Date(
                    leg.end.scheduledTime
                  ).toLocaleTimeString()}
                </li>
              `
              )
              .join('');

            return `
              <div>
                <h3>Reitti ${index + 1}</h3>
                <p>Aloitus: ${new Date(start).toLocaleTimeString()}</p>
                <p>Päättyy: ${new Date(end).toLocaleTimeString()}</p>
                <ul>${legsHtml}</ul>
              </div>
            `;
          })
          .join('');

        addressSection.innerHTML = `
          <h2>Routes to ${r.name}</h2>
          ${routeHtml}
        `;
      } catch (error) {
        console.error('Error fetching menu or route data:', error.message);
        modal.innerHTML = '<p>Failed to load data. Please try again later.</p>';
      }
    });
  });
};
