export async function fetchPicture(formData) {
  try {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('Token Payload:', payload);
    console.log('Token:', token);
    console.log('User ID:', id);

    // Check for user ID mismatch
    if (id !== payload.user_id.toString()) {
      console.error('User ID mismatch:', {id, userIdInToken: payload.user_id});
      alert('Sinulla ei ole oikeuksia tähän toimintoon.');
      return;
    }

    // Log the formData being sent
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    const response = await fetch(`http://10.120.32.93/app/api/v1/users/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log('Response Data:', responseData);
      localStorage.removeItem('filename');
      localStorage.setItem('filename', responseData.updatedUser.thumbnailPath);
    } else {
      const errorData = await response.json();
      console.error('Error updating profile:', errorData);
      alert(`Virhe: ${errorData.message}`);
    }
  } catch (error) {
    console.error('Error during profile update:', error);
    alert('Tapahtui virhe. Yritä myöhemmin uudelleen.');
  }
}

export async function fetchPictureWithId(id) {
  try {
    const token = localStorage.getItem('token');
    console.log(id);
    console.log(token);
    const response = await fetch(`http://10.120.32.93/app/api/v1/users/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log(responseData);
      const filePath = responseData.filename;
      console.log(filePath);
      localStorage.setItem('filename', filePath);
    } else {
      const errorData = await response.json();
      console.error('Profiilin päivitys epäonnistui:', errorData);
      alert(`Virhe: ${errorData.message}`);
    }
  } catch (error) {
    console.error('Virhe profiilin päivityksessä:', error);
    alert('Tapahtui virhe. Yritä myöhemmin uudelleen.');
  }
}
