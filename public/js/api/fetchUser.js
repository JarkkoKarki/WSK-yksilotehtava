import {usersUrl} from '../utils/variables.js';

export const putUser = async (formData) => {
  try {
    const response = await fetch(`${usersUrl}/${localStorage.getItem('id')}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response from server:', errorData);
      throw new Error('Failed to update profile');
    }

    const returnd = await response.json();
    console.log(returnd);
    return returnd;
  } catch (error) {
    console.error('Error during profile update:', error);
    throw error;
  }
};
