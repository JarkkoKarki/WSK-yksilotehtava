import {apiUrlRestaurant} from './variables.js';
import {createErrorHtml} from '../components/html.js';

export const getDailyMenu = async (id, lang, day) => {
  try {
    const response = await fetch(
      `${apiUrlRestaurant}/restaurants/weekly/${id}/${lang}`
    );
    console.log(response);
    if (!response.ok) {
      console.error(`Error: ${response.status} ${response.statusText}`);
      createErrorHtml();
      return null;
    }

    const menu = await response.json();

    if (menu && menu.days) {
      return menu.days[day];
    } else {
      console.warn('Not menu for the chosen day.');
      createErrorHtml();
      return null;
    }
  } catch (e) {
    createErrorHtml();
    console.warn(e);
    return null;
  }
};
export const getWeeklyMenu = async (id, lang) => {
  try {
    const response = await fetch(
      `${apiUrlRestaurant}/restaurants/weekly/${id}/${lang}`
    );

    if (!response.ok) {
      console.error(`Error: ${response.status} ${response.statusText}`);
      createErrorHtml();
      return null;
    }
    const menu = await response.json();

    if (menu && menu.days && menu.days.length > 0) {
      return menu.days;
    } else {
      createErrorHtml();
      return null;
    }
  } catch (error) {
    console.error('Error fetching weekly menu:', error.message);
  }
};
