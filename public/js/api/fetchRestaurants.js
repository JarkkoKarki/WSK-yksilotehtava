import {apiUrl} from '../variables.js';

export const fetchRestaurants = async () => {
  try {
    const response = await fetch(apiUrl + '/restaurants');
    const allRestaurants = await response.json();
    const restaurants = [...allRestaurants];
    return restaurants;
  } catch (error) {
    console.error('Error fetching restaurants:', error.message);
  }
};
