import L from 'leaflet';
import {fetchBussStops} from '../api/fetchApi.js';
import {userIcon, normalIcon, customIcon, bussIcon} from './mapIcons.js';

let map;
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

export const updateMapMarkers = async (restaurants, userCoords) => {
  clearMarkers();

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

  const userMarker = L.marker([userLat, userLng], {icon: userIcon})
    .bindPopup('Olet täällä!')
    .addTo(map);
  markers.push(userMarker);

  await addBusStops(userLng, userLat);
  if (closest) await addBusStops(...closest.location.coordinates.reverse());

  for (const r of restaurants) {
    const [lng, lat] = r.location.coordinates;
    if (isNaN(lat) || isNaN(lng)) continue;

    const marker = L.marker([lat, lng], {
      icon: r._id === closest?._id ? customIcon : normalIcon,
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
