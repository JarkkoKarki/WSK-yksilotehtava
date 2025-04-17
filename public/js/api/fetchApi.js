import {bussStopsUrl, locationUrl} from '../utils/variables.js';
export const fetchAddress = async (longitude, latitude) => {
  try {
    const response = await fetch(`${locationUrl}/${longitude}/${latitude}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch address: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching address:', error.message);
    throw error;
  }
};

export const fetchBussStops = async (longitude, latitude) => {
  try {
    const response = await fetch(
      `${bussStopsUrl}/${longitude}/${latitude}/500`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch address: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching address:', error.message);
    throw error;
  }
};
