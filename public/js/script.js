import components from './components.js';

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
