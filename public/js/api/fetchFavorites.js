export const fetchFavorites = async () => {
  try {
    const userId = localStorage.getItem('id');
    const token = localStorage.getItem('token');
    const response = await fetch(
      `https://10.120.32.93/app/api/v1/favorites/${userId}`,
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
