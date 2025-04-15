export const logoutUser = async () => {
  try {
    const response = await fetch(
      'https://10.120.32.93/app/api/v1/auth/logout',
      {
        method: 'GET',
      }
    );

    if (response.ok) {
      alert('Kirjauduttu ulos onnistuneesti!');
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('filename');
      window.location.href = 'index.html';
    } else {
      const error = await response.json();
      alert(`Virhe uloskirjautumisessa: ${error.message}`);
    }
  } catch (error) {
    console.error('Error during logout:', error);
    alert('Palvelimeen ei saatu yhteyttä.');
  }
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('filename');
  localStorage.removeItem('id');
};
