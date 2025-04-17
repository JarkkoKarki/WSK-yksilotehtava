import {fetchAddress} from './api/fetchApi.js';
import {addressHtml} from './components/html.js';
import components from './components/components.js';
import {initMap} from './map/map.js';

document.addEventListener('DOMContentLoaded', () => {
  const main = async () => {
    try {
      const getPosition = () =>
        new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve,
            reject,
            components.options
          );
        });

      const position = await getPosition();
      const {longitude, latitude} = position.coords;
      initMap({latitude, longitude});
      const address = await fetchAddress(longitude, latitude);
      const addrhtml = addressHtml(address.address);

      const addressElement = document.querySelector('#address');
      if (addressElement) {
        addressElement.innerHTML = addrhtml;
      } else {
        console.error('Address element not found in the DOM.');
      }

      components.success(position);
    } catch (error) {
      console.error('An error occurred:', error.message);
      components.error();
      alert('Location failed. Using default location.');
    }
  };

  main();
});
