import {fetchData} from '../../lib/fetchData.js';
import {apiUrl} from './variables.js';
import {sortByName} from './utils.js';
import {menuHtml} from './html.js';

const taulukko = document.querySelector('#target');
const modal = document.querySelector('#modal');
let restaurants = [];

var map;

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

function success(pos) {
  const crd = pos.coords;
  console.log(crd);

  if (!map) {
    map = L.map('map').setView([crd.latitude, crd.longitude], 12);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
  }

  updateMapMarkers();
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
  alert('Unable to access your location. Using default location.');

  if (!map) {
    map = L.map('map').setView([60.1699, 24.9384], 12); // Default to Helsinki
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    console.log('Map initialized with default location.');
  }

  updateMapMarkers();
}
//arrow funktio + object destructuring
const RestaurantRow = ({name, address, city}, tr) => {
  //nimisolu
  const nameTd = document.createElement('td');
  nameTd.innerText = name;

  //osoitesolu
  const addressTd = document.createElement('td');
  addressTd.innerText = address;
  //kaupunkisolu
  const cityTd = document.createElement('td');
  cityTd.innerText = city;
  //lisÃ¤tÃ¤Ã¤n solut riviin
  tr.append(nameTd, addressTd, cityTd);
};

const restaurantModal = (
  {name, address, city, postalCode, phone, company},
  modal
) => {
  const restaurantName = document.createElement('h1');
  restaurantName.innerText = name;

  const addressP = document.createElement('p');
  addressP.innerText = address;

  const cityP = document.createElement('p');
  cityP.innerText = city;

  const postalP = document.createElement('p');
  postalP.innerText = postalCode;

  const phoneP = document.createElement('p');
  phoneP.innerText = phone;

  const companyNameP = document.createElement('p');
  companyNameP.innerText = `Ravintola: ${company}`;

  const closeButton = document.createElement('button');
  closeButton.innerText = 'Close';
  closeButton.style.marginTop = '1rem';
  closeButton.style.cursor = 'pointer';
  closeButton.style.position = 'absolute';
  closeButton.style.top = '0';
  closeButton.style.right = '0';
  closeButton.style.margin = '1rem';
  closeButton.addEventListener('click', () => {
    modal.close();
  });

  modal.append(
    closeButton,
    restaurantName,
    addressP,
    cityP,
    postalP,
    phoneP,
    companyNameP
  );
};

const createMenuHtml = (courses) => {
  return menuHtml(courses);
};

// hae kaikki ravintolat
const getRestaurants = async () => {
  try {
    restaurants = await fetchData(apiUrl + '/restaurants');
    console.log(restaurants);
  } catch (error) {
    console.error(error.message);
  }
};

//hae tietyn ravintolan pÃ¤ivÃ¤n menu

const getDailyMenu = async (id, lang) => {
  try {
    return await fetchData(`${apiUrl}/restaurants/daily/${id}/${lang}`);
  } catch (error) {
    console.error(error.message);
  }
};

const getWeeklyMenu = async (id, lang) => {
  try {
    return await fetchData(`${apiUrl}/restaurants/weekly/${id}/${lang}`);
  } catch (error) {
    console.error(error.message);
  }
};
// restaurants aakkosjÃ¤rjestykseen

/*  Destrukturointi
const sortByName = ({name}, {name: bName}) =>
  name.toUpperCase() > bName.toUpperCase() ? 1 : -1;
*/

let markers = [];

function clearMarkers() {
  if (!map) {
    console.warn('Map is not initialized. Cannot clear markers.');
    return;
  }

  console.log('Clearing markers:', markers.length);
  markers.forEach((marker) => {
    if (map.hasLayer(marker)) {
      map.removeLayer(marker);
    }
  });
  markers = [];
  console.log('Markers cleared. Remaining:', markers.length);
}
const sortRestaurants = () => {
  restaurants.sort(sortByName);
};

function updateMapMarkers() {
  if (!map) {
    console.error('Map is not initialized.');
    return;
  }

  clearMarkers();

  for (const restaurant of restaurants) {
    const marker = L.marker([
      restaurant.location.coordinates[1],
      restaurant.location.coordinates[0],
    ])
      .addTo(map)
      .bindPopup(restaurant.name);
    marker.on('click', () => menuHtml(restaurant));
    markers.push(marker);
  }
}

document.querySelector('#submit').addEventListener('click', (event) => {
  event.preventDefault(); // Prevent default form submission behavior

  const selectedValue = document.querySelector('#provider').value.toLowerCase();
  const selectedCityValue = document.querySelector('#city').value.toLowerCase();

  const filteredRestaurants = restaurants.filter((restaurant) => {
    return (
      (selectedValue === 'all' ||
        restaurant.company.toLowerCase() === selectedValue) &&
      (selectedCityValue === 'all' ||
        restaurant.city.toLowerCase() === selectedCityValue)
    );
  });

  createTable(filteredRestaurants); // Update the table with filtered results
});

let selectedRestaurant = null; // Store the selected restaurant globally

const createTable = (filteredRestaurants = restaurants) => {
  taulukko.innerHTML = ''; // Clear the table
  clearMarkers(); // Clear map markers

  if (filteredRestaurants.length === 0) {
    const noDataMessage = document.createElement('p');
    noDataMessage.innerText =
      'No restaurants found. Please adjust your filters.';
    taulukko.append(noDataMessage);
    return;
  }

  filteredRestaurants.forEach((restaurant) => {
    const tr = document.createElement('tr');

    tr.addEventListener('click', async () => {
      try {
        for (const elem of document.querySelectorAll('.highlight')) {
          elem.classList.remove('highlight');
        }
        tr.classList.add('highlight');
        map.setView(
          [
            restaurant.location.coordinates[1],
            restaurant.location.coordinates[0],
          ],
          15
        );

        const marker = L.marker([
          restaurant.location.coordinates[1],
          restaurant.location.coordinates[0],
        ])
          .addTo(map)
          .bindPopup(restaurant.name);
        marker.openPopup();

        selectedRestaurant = restaurant;

        console.log(`Selected restaurant: ${restaurant.name}`);
      } catch (error) {
        console.error(error.message);
      }
    });

    RestaurantRow(restaurant, tr);
    taulukko.append(tr);

    const marker = L.marker([
      restaurant.location.coordinates[1],
      restaurant.location.coordinates[0],
    ])
      .addTo(map)
      .bindPopup(restaurant.name);

    marker.on('click', () => addInfoHtml(restaurant));
    markers.push(marker);
  });
};

document.querySelector('#menu').addEventListener('change', async (event) => {
  const selectedMenuType = event.target.value;
  const dayContainer = document.querySelector('#day');
  dayContainer.innerHTML = '';

  if (!selectedRestaurant) {
    alert('Please select a restaurant first.');
    return;
  }

  try {
    if (selectedMenuType === 'päivä') {
      const selectElement = document.createElement('select');
      selectElement.id = 'day-select';
      selectElement.name = 'day';

      const days = [
        {value: 'Maanantai', text: 'Maanantai'},
        {value: 'Tiistai', text: 'Tiistai'},
        {value: 'Keskiviikko', text: 'Keskiviikko'},
        {value: 'Torstai', text: 'Torstai'},
        {value: 'Perjantai', text: 'Perjantai'},
        {value: 'Lauantai', text: 'Lauantai'},
        {value: 'Sunnuntai', text: 'Sunnuntai'},
      ];

      days.forEach((day) => {
        const option = document.createElement('option');
        option.value = day.value;
        option.textContent = day.text;
        selectElement.appendChild(option);
      });

      dayContainer.appendChild(document.querySelector('#menu'));

      selectElement.addEventListener('change', async (dayEvent) => {
        const selectedDay = dayEvent.target.value;
        console.log('Selected day:', selectedDay);

        try {
          const dailyMenu = await getDailyMenu(selectedRestaurant._id, 'fi');
          if (!dailyMenu || !dailyMenu.courses) {
            throw new Error('Invalid daily menu data');
          }

          const filteredCourses = dailyMenu.courses.filter(
            (course) => course.day === selectedDay
          );

          const menuHtmlContent = createMenuHtml(filteredCourses);
          dayContainer.innerHTML = menuHtmlContent;
        } catch (error) {
          console.error('Error fetching daily menu:', error.message);
          alert('Failed to fetch the daily menu. Please try again.');
        }
      });
    } else if (selectedMenuType === 'viikko') {
      try {
        const weeklyMenu = await getWeeklyMenu(selectedRestaurant._id, 'fi');
        if (!weeklyMenu || !weeklyMenu.days) {
          throw new Error('Invalid weekly menu data');
        }

        const weeklyMenuHtml = weeklyMenu.days
          .map((day) => {
            const dayCoursesHtml = createMenuHtml(day.courses);
            return `<h3>${day.date}</h3>${dayCoursesHtml}`;
          })
          .join('');
        dayContainer.innerHTML = weeklyMenuHtml;
      } catch (error) {
        console.error('Error fetching weekly menu:', error.message);
        alert('Failed to fetch the weekly menu. Please try again.');
      }
    }
  } catch (error) {
    console.error('Error handling menu selection:', error.message);
    alert('An error occurred. Please try again.');
  }
});

export default {
  getRestaurants,
  sortRestaurants,
  createTable,
  success,
  options,
  error,
  restaurants,
};
