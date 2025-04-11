document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('register-form');

  if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const username = document.getElementById('username').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      const profilePicture =
        document.getElementById('profile-picture').files[0];

      if (password !== confirmPassword) {
        alert('Salasanat eivät täsmää!');
        return;
      }

      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('name', username);
      if (profilePicture) {
        formData.append('profilePicture', profilePicture);
      }

      try {
        const response = await fetch('http://10.120.32.93/app/api/v1/users', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const responseData = await response.json();
          const thumbnail = responseData.result.thumbnailPath;
          console.log(thumbnail);
          localStorage.setItem('filename', thumbnail);
          window.location.href = 'login.html';
        }
      } catch (error) {
        console.error('Error during registration:', error);
        alert('Palvelimeen ei saatu yhteyttä.');
      }
    });
  }
  document.getElementById('guest-button').addEventListener('click', () => {
    window.location.href = 'index.html';
  });
});
