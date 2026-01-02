# Food Delivery App

A modern, responsive food delivery application built with React, Vite, and Tailwind CSS, featuring Firebase Authentication.

## Features

- **Authentication**: Secure Login and Registration using Firebase Auth.
- **Browse Restaurants**: View top restaurants with responsive grid layouts.
- **Restaurant Details**: View menus, filter by Veg/Non-Veg, sort by price, and add items to cart.
- **Cart Management**: Add/remove items, apply coupons (e.g., `WELCOME50`, `FREEDEL`), and place orders.
- **User Profile**: View order history and manage profile settings.
- **Offers**: Browse available discount codes.
- **Dark Mode**: Toggle between light and dark themes.
- **Responsive Design**: fully optimized for mobile, tablet, and desktop.

## Technology Stack

- **Frontend**: React.js, Vite
- **Styling**: Tailwind CSS
- **Authentication**: Firebase (Google Auth, Email/Password)
- **State Management**: Context API (CartContext, ThemeContext)
- **Routing**: React Router DOM

## Getting Started

### Prerequisites

- Node.js installed on your machine.

### Installation

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Set up Firebase:
    - Create a file `frontend/src/firebaseConfig.js` with your Firebase credentials if not already present.

### Running the App

Start the development server:

```bash
npm run dev
```

The application will run at `http://localhost:5173`.

## Folder Structure

- `src/components`: Reusable UI components (Navbar, Footer, RestaurantCard, etc.)
- `src/pages`: Main application pages (Home, Login, Cart, Profile, etc.)
- `src/context`: Global state management.
- `src/data`: Mock data for restaurants and food items.

## Contributing

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.
