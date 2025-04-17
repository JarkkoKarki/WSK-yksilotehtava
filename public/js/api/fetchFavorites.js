import {favoriteUrl} from '../utils/variables.js';

export const fetchFavorites = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${favoriteUrl}/${localStorage.getItem('id')}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Virhe suosikkien lataamisessa.');
    }

    const favorites = await response.json();
    return favorites;
  } catch (error) {
    console.error('Virhe suosikkien lataamisessa:', error);
  }
};
