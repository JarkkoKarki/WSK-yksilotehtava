import {getRouteData} from '../api/route.js';

let currentPolyline = null;

const drawRouteOnMap = async (
  map,
  startLat,
  startLng,
  endLat,
  endLng,
  color = 'blue'
) => {
  try {
    const routeData = await getRouteData(startLat, startLng, endLat, endLng);

    if (
      !routeData ||
      !routeData.decodedLegs ||
      routeData.decodedLegs.length === 0
    ) {
      console.error('No route coordinates available.');
      return;
    }

    const routeCoordinates = [];

    routeData.decodedLegs[0].forEach((leg) => {
      if (leg.decodedPoints && leg.decodedPoints.length > 0) {
        leg.decodedPoints.forEach((point) => {
          if (Array.isArray(point) && point.length === 2) {
            routeCoordinates.push([point[0], point[1]]);
          }
        });
      }
    });

    if (routeCoordinates.length > 0) {
      if (currentPolyline) {
        map.removeLayer(currentPolyline);
      }
      currentPolyline = L.polyline(routeCoordinates, {
        color: color,
        weight: 4,
        opacity: 0.7,
      }).addTo(map);

      map.fitBounds(currentPolyline.getBounds());
    } else {
      console.warn('No valid coordinates for the route.');
    }
  } catch (error) {
    console.error('Error drawing route on map:', error.message);
  }
};
export const fetchAndDisplayRoute = async (
  map,
  startLat,
  startLng,
  endLat,
  endLng
) => {
  try {
    const routeDetails = await getRouteData(startLat, startLng, endLat, endLng);

    if (!routeDetails || !routeDetails.decodedLegs) {
      console.error('No route details available.');
      return;
    }

    const routeHtml = routeDetails.decodedLegs;
    await drawRouteOnMap(map, startLat, startLng, endLat, endLng);
  } catch (error) {
    console.error('Error fetching and displaying route:', error.message);
  }
};
