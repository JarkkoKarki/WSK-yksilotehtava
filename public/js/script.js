import components from './components.js';
import {fetchAddress} from './fetchAddress.js';
import {addressHtml} from './html.js';

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

      // Fetch the address using the user's location
      const address = await fetchAddress(longitude, latitude);
      const addrhtml = addressHtml(address.address);
      document.querySelector('#address').innerHTML = addrhtml;

      components.success(position);

      await components.getRestaurants();
      components.sortRestaurants();
      components.createTable();
    } catch (error) {
      console.error('An error occurred:', error.message);
      alert('Refresh page');
    }
  };

  main();
});
