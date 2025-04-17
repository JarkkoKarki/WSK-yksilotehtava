import {logoutUrl} from '../utils/variables.js';

export const logoutUser = async () => {
  try {
    const response = await fetch(logoutUrl, {
      method: 'GET',
    });

    if (response.ok) {
      alert('Kirjauduttu ulos onnistuneesti!');
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('filename');
      localStorage.removeItem('id');
    } else {
      alert(`Virhe uloskirjautumisessa`);
    }
  } catch (error) {
    alert('Palvelimeen ei saatu yhteyttä.');
    console.warn(error);
  }
};
