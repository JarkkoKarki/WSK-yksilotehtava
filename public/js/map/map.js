import {fetchBussStops} from '../api/fetchApi.js';
import {
  normalIcon,
  userIcon,
  favoriteIcon,
  bussIcon,
  customIcon,
} from './mapIcons.js';
import {fetchFavorites} from '../api/fetchFavorites.js';
import {fetchRestaurants} from '../api/fetchRestaurants.js';
import {map} from '../components.js';
import {RestaurantRow} from '../components/restaurantRow.js';

let markers = [];

export const initMap = (coords) => {
  map = L.map('map').setView([coords.latitude, coords.longitude], 15);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);
};

export const getMap = () => map;

export const clearMarkers = () => {
  markers = markers.filter((marker) => {
    if (marker.options.icon === userIcon) return true;
    if (map.hasLayer(marker)) map.removeLayer(marker);
    return false;
  });
};

export const updateMapMarkers = async (userCoords, restaurants) => {
  clearMarkers();
  const favorites = await fetchFavorites();

  if (!restaurants) {
    restaurants = await fetchRestaurants();
  }
  const userLat = userCoords.latitude;
  const userLng = userCoords.longitude;
  let minDistance = Infinity,
    closest = null;

  for (const r of restaurants) {
    const [lng, lat] = r.location.coordinates;
    const dist = Math.hypot(userLat - lat, userLng - lng);
    if (dist < minDistance) {
      minDistance = dist;
      closest = r;
    }
  }
  const closestMarker = L.marker(
    [closest.location.coordinates[1], closest.location.coordinates[0]],
    {
      icon: customIcon,
    }
  )
    .bindPopup(closest.name)
    .addTo(map);
  markers.push(closestMarker);

  const userMarker = L.marker([userLat, userLng], {icon: userIcon})
    .bindPopup('Olet täällä!')
    .addTo(map);
  markers.push(userMarker);

  await addBusStops(
    closest.location.coordinates[0],
    closest.location.coordinates[1]
  );

  for (const r of restaurants) {
    const [lng, lat] = r.location.coordinates;
    if (isNaN(lat) || isNaN(lng)) continue;

    const isFavorite = favorites.some((fav) => fav.restaurant_id === r._id);
    const marker = L.marker([lat, lng], {
      icon: isFavorite ? favoriteIcon : normalIcon,
    })
      .bindPopup(r.name)
      .addTo(map);
    markers.push(marker);
  }
};
const addBusStops = async (lng, lat) => {
  try {
    const stops = await fetchBussStops(lng, lat);
    for (const s of stops) {
      const marker = L.marker([s.latitude, s.longitude], {icon: bussIcon})
        .bindPopup(s.description)
        .addTo(map);
      markers.push(marker);
    }
  } catch (e) {
    console.error('Bus stop error', e);
  }
};
