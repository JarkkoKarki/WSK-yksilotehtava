[![CodeFactor](https://www.codefactor.io/repository/github/jarkkokarki/wsk-yksilotehtava/badge)](https://www.codefactor.io/repository/github/jarkkokarki/wsk-yksilotehtava)

<img src="/lib/pictures/main.png">

# Opiskelijaravintolat

This project is a web application designed to help users locate student restaurants, view their menus, and filter restaurants based on various criteria. The application also includes user authentication, profile management, and geolocation features.

---

## Features

### 1. **User Authentication**

- **Registration**: Users can create an account by providing a username, email, password, and profile picture.
- **Login**: Users can log in using their credentials. Upon successful login, a token is stored in `localStorage` for session management.
- **Logout**: Users can log out, which clears their session data from `localStorage`.
- **Guest Access**: Users can browse the application without logging in, but some features (e.g., favorites) require authentication.

### 2. **Profile Management**

- Users can update their profile information, including their username and profile picture.
- Profile pictures are uploaded to the backend and displayed across the application.
- The profile page allows users to preview their profile picture before uploading.

### 3. **Restaurant Locator**

- Displays nearby restaurants on an interactive map using the **Leaflet** library.
- Users can filter restaurants by:
  - **City**: Options include Helsinki, Espoo, and Vantaa.
  - **Provider**: Options include Sodexo and Compass Group.
- Highlights the closest restaurant to the user's location.
- Displays nearby bus stops for convenience.

### 4. **Menu Viewing**

- Users can view daily and weekly menus for selected restaurants by clicking a restaurant from the list.
- Menus include:
  - **Name** of the dish.
  - **Price** (if available).
  - **Dietary information** (e.g., allergens).
- Menus are fetched dynamically from an external API.

### 5. **Favorites Management**

- Users can add or remove restaurants from their favorites list.
- The favorites page displays all saved restaurants and allows users to view their weekly menus.

### 6. **Geolocation**

- Automatically fetches the user's location to display nearby restaurants and bus stops.
- If location access is denied, a default location is used.

---

### 7. **Routes**

- Automatically displays the route to selected restaurant from the users location.
- Included with information about the length of the trip

## Technical Overview

### Frontend

- **HTML/CSS/JavaScript**: The application is built using vanilla JavaScript for interactivity and dynamic content rendering.
- **Leaflet**: Used for rendering the interactive map and markers for restaurants and bus stops.
- **Responsive Design**: The application is styled to work on both desktop and mobile devices.

### Backend Integration

- The application communicates with a backend server for:
  - **User Authentication**: Registration, login, and logout.
  - **Profile Management**: Uploading and retrieving profile pictures.
  - **Favorites Management**: Adding, removing, and fetching favorite restaurants.
  - **Bus Stops**: Fetching nearby bus stops based on the user's location.
  - **Routes**: Fetch route coordinates to the frontend
- **External API**: Restaurant data and menus are fetched from a separate API.

---

## File Structure

### Key Directories and Files

- **`public/`**: Contains all frontend assets.
  - **`css/`**: Stylesheets for the application.
  - **`js/`**: JavaScript files for functionality.
    - **`api/`**: Handles API calls (e.g., fetching restaurants, menus, and user data).
    - **`components/`**: Reusable UI components (e.g., modals, tables).
    - **`map/`**: Map-related functionality (e.g., initializing the map, adding markers).
    - **`pages/`**: Page-specific scripts (e.g., login, register, profile).
    - **`utils/`**: Utility functions (e.g., sorting, generating HTML).
  - **`lib/`**: Contains static assets like icons and images.
  - **`index.html`**: The main entry point of the application.
- **`README.md`**: Documentation for the project.
- **`.editorconfig`**: Configuration for consistent coding styles.
- **`.gitignore`**: Specifies files and directories to ignore in version control.

---

## Backend Server

This project relies on a backend server to handle various operations. The server repository can be found here:
[Server Repository](https://github.com/JarkkoKarki/WSK-yksilotehtava-server)

### Backend Responsibilities

- **Authentication**: Handles user registration, login, and logout.
- **Profile Management**: Manages profile picture uploads and retrieval.
- **Favorites**: Stores and retrieves user-specific favorite restaurants.
- **Bus Stops**: Provides nearby bus stop data based on geolocation.
- **Routes**: Fetch route from the user to the selected restaurant

---

## How to Run the Project

### Option 1: Open Using the Web

- Accept https certificates from https://10.120.32.93/app/api/v1/users

  - If your browser shows a security warning, type `thisisunsafe` to bypass it.
  - This step is required to securely access the backend API.

- go https://users.metropolia.fi/~jarkkaka/Yksilotehtava/public/

### Option 2: Open Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/JarkkoKarki/WSK-yksilotehtava.git
   cd WSK-yksilotehtava
   ```
