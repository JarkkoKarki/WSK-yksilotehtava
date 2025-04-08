import {fetchData} from '../../lib/fetchData.js';
import {apiUrl} from './variables.js';
import {sortByName} from './utils.js';

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

  modal.append(restaurantName, addressP, cityP, postalP, phoneP, companyNameP);
};

const createMenuHtml = (courses) => {
  let html = '';
  for (const {name, price, diets} of courses) {
    html += `
  <article class="course">
      <p><strong>${name}</strong>,
      Hinta: ${price} â‚¬,
      Allergeenit: ${diets}</p>
  </article>
  `;
  }
  return html;
};

// hae kaikki ravintolat
const getRestaurants = async () => {
  try {
    restaurants = await fetchData(apiUrl + '/restaurants');
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
// restaurants aakkosjÃ¤rjestykseen

/*  Destrukturointi
const sortByName = ({name}, {name: bName}) =>
  name.toUpperCase() > bName.toUpperCase() ? 1 : -1;
*/

let markers = [];

function clearMarkers() {
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
    marker.on('click', () => addInfoHtml(restaurant));
    markers.push(marker);
  }
}

const createTable = (filteredRestaurants = restaurants) => {
  taulukko.innerHTML = '';
  clearMarkers();
  if (filteredRestaurants.length === 0) {
    const noDataMessage = document.createElement('p');
    noDataMessage.innerText = 'Use VPN';
    taulukko.append(noDataMessage);
    return;
  }
  filteredRestaurants.forEach((restaurant) => {
    // rivi
    const tr = document.createElement('tr');

    tr.addEventListener('click', async () => {
      try {
        for (const elem of document.querySelectorAll('.highlight')) {
          elem.classList.remove('highlight');
        }

        tr.classList.add('highlight');
        //hae menu
        const coursesResponse = await getDailyMenu(restaurant._id, 'fi');
        // hae menu html
        const menuHtml = createMenuHtml(coursesResponse.courses);
        // tyhjennÃ¤ modal
        modal.innerHTML = '';
        //luo modal
        restaurantModal(restaurant, modal);
        //lisÃ¤Ã¤ menu html
        modal.insertAdjacentHTML('beforeend', menuHtml);

        //avaa modal
        modal.showModal();
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

  document.querySelector('#provider').addEventListener('change', (event) => {
    const selectedValue = event.target.value.toLowerCase();

    if (selectedValue === 'all') {
      createTable(restaurants);
    } else {
      const filteredRestaurants = restaurants.filter(
        (restaurant) => restaurant.company.toLowerCase() === selectedValue
      );
      createTable(filteredRestaurants);
    }
  });
};
export default {
  getRestaurants,
  sortRestaurants,
  createTable,
  success,
  options,
  error,
  restaurants,
};
