import {apiUrl} from '../variables';

export const getRoute = async (startLat, startLng, endLat, endLng) => {
  try {
    const response = await fetch(
      `${apiUrl}/route/${startLat}/${startLng}/${endLat}/${endLng}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch route: ${response.statusText}`);
    }

    const routeData = await response.json();
    console.log('Route Data:', routeData);
    return routeData;
  } catch (error) {
    console.error('Error fetching route:', error.message);
    return null;
  }
};

export const getRouteData = async (startLat, startLng, endLat, endLng) => {
  try {
    const response = await fetch(
      `${apiUrl}/route/legs/${startLat}/${startLng}/${endLat}/${endLng}`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch route coordinates: ${response.statusText}`
      );
    }

    const routeData = await response.json();
    console.log('Route Coordinates Data:', routeData);
    return routeData;
  } catch (error) {
    console.error('Error fetching route coordinates:', error.message);
    return null;
  }
};
