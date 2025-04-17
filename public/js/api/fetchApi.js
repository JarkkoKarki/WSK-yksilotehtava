import {locationUrl} from '../variables';
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
      `https://10.120.32.93/app/api/v1/buss/stops/${longitude}/${latitude}/500`
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
