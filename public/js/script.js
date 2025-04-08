import components from './components.js';

document.addEventListener('DOMContentLoaded', () => {
  const main = async () => {
    try {
      navigator.geolocation.getCurrentPosition(
        components.success,
        components.error,
        components.options
      );
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
