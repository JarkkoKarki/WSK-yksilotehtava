import {fetchData} from '../../lib/fetchdata.js';
import {apiUrl} from './variables.js';
import {sortByName} from './utils.js';
import {
  chooseDayModal,
  menuHtml,
  menuWeekHtml,
  createErrorHtml,
} from './html.js';
import {fetchBussStops} from './api/fetchApi.js';
import {createTable} from './components/restaurantUI.js';

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
    createTable(restaurants, modal, taulukko);
  } catch (error) {
    console.error('Error fetching restaurants:', error.message);
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
  createTable(restaurants, modal, taulukko);
});

let selectedRestaurant = null;

export default {
  getRestaurants,
  sortRestaurants,
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
