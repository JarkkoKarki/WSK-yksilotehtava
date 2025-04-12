export const fetchAddress = async (longitude, latitude) => {
  try {
    const response = await fetch(
      `http://10.120.32.93/app/api/v1/api/location/${longitude}/${latitude}`
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

export const fetchBussStops = async (longitude, latitude) => {
  try {
    const response = await fetch(
      `http://10.120.32.93/app/api/v1/buss/stops/${longitude}/${latitude}/500`
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

console.log(
  'http://10.120.32.93/app/api/v1/buss/stops/24.93/60.199/500 endpoint for Buss stops'
);
