# js-template

https://users.metropolia.fi/~jarkkaka/WSK-25/

<img src="/lib/pictures/main.png">

# Opiskelijaravintolat

This project is a web application designed to help users locate student restaurants, view their menus, and filter restaurants based on various criteria. The application also includes user authentication, profile management, and geolocation features.

## Features

1. **User Authentication**:

   - Users can register, log in, and log out.
   - Guest access is available for browsing without authentication.

2. **Profile Management**:

   - Users can update their profile information, including uploading a profile picture.

3. **Restaurant Locator**:

   - Displays nearby restaurants on an interactive map using Leaflet.
   - Users can filter restaurants by city and provider.
   - Closest restaurant and nearby bus stops are highlighted.

4. **Menu Viewing**:

   - Users can view daily and weekly menus for selected restaurants.
   - Menus include details like price and dietary information.

5. **Geolocation**:
   - Automatically fetches the user's location to display nearby restaurants and bus stops.

## Backend Server

This project relies on a backend server to:

- Handle user authentication (registration, login, and logout).
- Fetch nearby bus stops based on the user's location.
- Manage user profile pictures (upload and retrieval).

- [Server Repository](https://github.com/JarkkoKarki/WSK-yksilotehtava-server)

Restaurants are fetched from a different API.
