document.addEventListener('DOMContentLoaded', () => {
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');

  if (!token) {
    alert('Sinun täytyy kirjautua sisään!');
    window.location.href = 'login.html';
    return;
  }

  document.getElementById('username').textContent = username;
  const logout = document.querySelector('.logout');
  document
    .getElementById('update-profile-form')
    .addEventListener('submit', async (event) => {
      event.preventDefault();

      try {
        const response = await fetch(
          'http://10.120.32.80/app/api/v1/user/update',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (response.ok) {
          alert('Profiili päivitetty onnistuneesti!');
        } else {
          const error = await response.json();
          alert(`Virhe: ${error.message}`);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Palvelimeen ei saatu yhteyttä.');
      }
    });
  logout.addEventListener('click', async () => {
    try {
      const response = await fetch(
        'http://10.120.32.80/app/api/v1/auth/logout',
        {
          method: 'get',
        }
      );

      if (response.ok) {
        alert('Kirjauduttu ulos onnistuneesti!');
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
    window.location.href = 'index.html';
  });
});

// Logout
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  window.location.href = 'login.html';
}
