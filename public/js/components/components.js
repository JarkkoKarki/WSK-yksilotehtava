import {sortByName} from '../utils/utils.js';
import {createTable} from './restaurantUI.js';
import {updateMapMarkers, map} from '../map/map.js';
import {fetchRestaurants} from '../api/fetchRestaurants.js';

const taulukko = document.querySelector('#target');
const modal = document.querySelector('#modal');
let restaurants = [];
export let allRestaurants = [];
let crd = {};

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

async function success(pos) {
  crd = pos.coords;

  if (!map) {
    L.map('map').setView([crd.latitude, crd.longitude], 15);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
  }
  allRestaurants = await fetchRestaurants();
  createTable(allRestaurants, modal, taulukko, crd);
  updateMapMarkers(crd);
}

function error(err) {
  alert('Unable to access your location. Using default location.');
  crd = {latitude: 60.1699, longitude: 24.9384};
  console.warn(err);

  if (!map) {
    L.map('map').setView([60.1699, 24.9384], 12);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
  }

  updateMapMarkers(crd);
}

const sortRestaurants = () => {
  restaurants.sort(sortByName);
};

document.querySelector('#submit').addEventListener('click', async (event) => {
  event.preventDefault();

  const selectedValue = document.querySelector('#provider').value.toLowerCase();
  const selectedCityValue = document.querySelector('#city').value.toLowerCase();

  filterAndUpdate(selectedValue, selectedCityValue);
});

const filterAndUpdate = (selectedValue, selectedCityValue) => {
  if (selectedValue === 'all' && selectedCityValue === 'all') {
    restaurants = [...allRestaurants];
  } else {
    restaurants = allRestaurants.filter((restaurant) => {
      const company = restaurant.company?.toLowerCase() || '';
      const city = restaurant.city?.toLowerCase() || '';
      return (
        (selectedValue === 'all' || company === selectedValue) &&
        (selectedCityValue === 'all' || city === selectedCityValue)
      );
    });
  }
  updateMapMarkers(crd, restaurants);
  createTable(restaurants, modal, taulukko, crd);
};

export default {
  sortRestaurants,
  success,
  options,
  error,
  restaurants,
};
