import {fetchData} from '../../lib/fetchdata.js';
import {apiUrl} from './variables.js';
import {sortByName} from './utils.js';
import {
  chooseDayModal,
  menuHtml,
  menuWeekHtml,
  createErrorHtml,
} from './html.js';
import {fetchBussStops} from './fetchApi.js';

const taulukko = document.querySelector('#target');
const modal = document.querySelector('#modal');
let restaurants = [];
let allRestaurants = [];
var map;

let iconOptions = {
  iconUrl: '../../lib/leaflet/red-icon.svg',
  iconSize: [25, 41],
};
var customIcon = L.icon(iconOptions);
let crd = {};

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

async function success(pos) {
  crd = pos.coords;

  if (!map) {
    map = L.map('map').setView([crd.latitude, crd.longitude], 15);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
  }
  await getRestaurants();
  updateMapMarkers(crd);
}

function error(err) {
  alert('Unable to access your location. Using default location.');

  if (!map) {
    map = L.map('map').setView([60.1699, 24.9384], 12);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
  }

  updateMapMarkers();
}

const RestaurantRow = ({name, address, city}, tr) => {
  const nameTd = document.createElement('td');
  nameTd.innerText = name;

  const addressTd = document.createElement('td');
  addressTd.innerText = address;

  const cityTd = document.createElement('td');
  cityTd.innerText = city;

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

const createDayHtml = () => {
  return chooseDayModal();
};

const createMenuHtml = (courses) => {
  return menuHtml(courses);
};

const createMenuWeek = (courses) => {
  return menuWeekHtml(courses);
};

const getRestaurants = async () => {
  try {
    allRestaurants = await fetchData(apiUrl + '/restaurants');
    restaurants = [...allRestaurants];
  } catch (error) {
    console.error(error.message);
  }
};

const getDailyMenu = async (id, lang, day) => {
  try {
    const menu = await fetchData(`${apiUrl}/restaurants/weekly/${id}/${lang}`);
    if (menu && menu.days && menu.days[day]) {
      return menu.days[day];
    } else {
      createErrorHtml();
      return null;
    }
  } catch (error) {
    console.error(error.message);
  }
};

const getWeeklyMenu = async (id, lang) => {
  try {
    const menu = await fetchData(`${apiUrl}/restaurants/weekly/${id}/${lang}`);
    if (menu && menu.days.length > 0) {
      return menu.days;
    } else {
      createErrorHtml();
      return null;
    }
  } catch (error) {
    console.error(error.message);
  }
};

let markers = [];

function clearMarkers() {
  markers = markers.filter((marker) => {
    if (marker.options.icon === userIcon) {
      return true;
    }
    if (map.hasLayer(marker)) {
      map.removeLayer(marker);
    }
    return false;
  });
}

const sortRestaurants = () => {
  restaurants.sort(sortByName);
};

var normalIcon = L.icon({
  iconUrl: '../../lib/leaflet/normal-icon.svg',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

var userIcon = L.icon({
  iconUrl: '../../lib/leaflet/user-icon.svg',
  iconSize: [38, 95],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

async function updateMapMarkers(crd) {
  if (!map) {
    console.error('Map is not initialized.');
    return;
  }

  clearMarkers();

  if (!restaurants || restaurants.length === 0) {
    return;
  }

  const userLat = crd.latitude;
  const userLng = crd.longitude;

  let closestRestaurantId = null;
  let minDistance = Infinity;
  let closestlng = null;
  let closestlat = null;

  for (const restaurant of restaurants) {
    const restaurantLat = restaurant.location.coordinates[1];
    const restaurantLng = restaurant.location.coordinates[0];

    const distance = Math.sqrt(
      Math.pow(userLat - restaurantLat, 2) +
        Math.pow(userLng - restaurantLng, 2)
    );

    if (distance < minDistance) {
      minDistance = distance;
      closestRestaurantId = restaurant._id;
      closestlat = restaurantLat;
      closestlng = restaurantLng;
    }
  }

  const userMarker = L.marker([userLat, userLng], {
    icon: userIcon,
  })
    .bindPopup('Olet täällä!')
    .addTo(map);
  markers.push(userMarker);

  if (closestlat && closestlng) {
    await bussStops(closestlng, closestlat);
  }

  await bussStops(userLng, userLat);

  for (const restaurant of restaurants) {
    const lat = restaurant.location.coordinates[1];
    const lng = restaurant.location.coordinates[0];

    if (isNaN(lat) || isNaN(lng)) {
      continue;
    }
    const marker = L.marker([lat, lng], {
      icon: restaurant._id === closestRestaurantId ? customIcon : normalIcon,
    })
      .addTo(map)
      .bindPopup(restaurant.name);
    markers.push(marker);
  }
}

document.querySelector('#submit').addEventListener('click', (event) => {
  event.preventDefault();

  const selectedValue = document.querySelector('#provider').value.toLowerCase();
  const selectedCityValue = document.querySelector('#city').value.toLowerCase();

  if (selectedValue === 'all' && selectedCityValue === 'all') {
    restaurants = [...allRestaurants];
  } else {
    restaurants = allRestaurants.filter((restaurant) => {
      return (
        (selectedValue === 'all' ||
          restaurant.company.toLowerCase() === selectedValue) &&
        (selectedCityValue === 'all' ||
          restaurant.city.toLowerCase() === selectedCityValue)
      );
    });
  }

  updateMapMarkers(crd);
  createTable(restaurants);
});

let selectedRestaurant = null;

const createTable = (filteredRestaurants = restaurants) => {
  taulukko.innerHTML = '';

  clearMarkers();

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
        selectedRestaurant = restaurant;
        modal.innerHTML = '';
        const dayHtml = createDayHtml();

        modal.insertAdjacentHTML('beforeend', dayHtml);
        modal.showModal();
        const dayButtons = document.querySelectorAll('.day');
        dayButtons.forEach((button) => {
          button.addEventListener('click', async (event) => {
            modal.innerHTML = '';
            event.preventDefault();

            const selectedDay = event.target.value;
            modal.innerHTML = '';
            if (selectedDay != 7) {
              const coursesResponse = await getDailyMenu(
                restaurant._id,
                'fi',
                selectedDay
              );
              try {
                const menuHtml = createMenuHtml(
                  coursesResponse.courses[selectedDay],
                  day
                );
                restaurantModal(restaurant, modal);
                modal.insertAdjacentHTML('beforeend', menuHtml);
              } catch (error) {
                const errors = createErrorHtml();
                restaurantModal(restaurant, modal);
                modal.insertAdjacentHTML('beforeend', errors);
              }
            } else {
              const coursesForWeek = await getWeeklyMenu(restaurant._id, 'fi');
              const menuHtml = createMenuWeek(coursesForWeek);
              restaurantModal(restaurant, modal);
              modal.insertAdjacentHTML('beforeend', menuHtml);
            }
          });
        });
      } catch (error) {
        console.error(error.message);
      }
    });

    RestaurantRow(restaurant, tr);
    taulukko.append(tr);

    const lat = restaurant.location.coordinates[1];
    const lng = restaurant.location.coordinates[0];

    if (!isNaN(lat) && !isNaN(lng)) {
      const marker = L.marker([lat, lng], {
        icon: normalIcon,
      })
        .addTo(map)
        .bindPopup(restaurant.name);
      markers.push(marker);
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

async function bussStops(lng, lat) {
  var bussIcon = L.icon({
    iconUrl: '../../lib/leaflet/buss-icon.svg',
    iconSize: [10, 15],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  try {
    const bussStops = await fetchBussStops(lng, lat);
    for (const bussStop of bussStops) {
      const stopName = bussStop.description;
      const stopLat = bussStop.latitude;
      const stopLng = bussStop.longitude;

      const bussMarker = L.marker([stopLat, stopLng], {
        icon: bussIcon,
      })
        .bindPopup(`${stopName}`)
        .addTo(map);
      markers.push(bussMarker);
    }
  } catch (error) {
    console.error('Error fetching bus stops:', error);
  }
}
