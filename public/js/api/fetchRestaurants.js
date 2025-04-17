import {apiUrlRestaurant} from '../variables.js';

export const fetchRestaurants = async () => {
  try {
    const response = await fetch(apiUrlRestaurant + '/restaurants');
    const allRestaurants = await response.json();
    const restaurants = [...allRestaurants];
    return restaurants;
  } catch (error) {
    console.error('Error fetching restaurants:', error.message);
  }
};
