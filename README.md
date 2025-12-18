<div align="center">

# ⛽ Zapetrol Frontend

### Real-time fuel price comparison platform for Spain

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Mapbox](https://img.shields.io/badge/Mapbox-000000?style=for-the-badge&logo=mapbox&logoColor=white)

[🚀 Live Demo](https://zapetrol-frontend-2369.vercel.app/)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Key Features](#-key-features)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Project](#-running-the-project)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Design System](#-design-system)
- [Responsive Views](#-responsive-views)
- [Geolocation Flow](#-geolocation-flow)
- [Technologies](#-technologies)
- [Available Scripts](#%EF%B8%8F-available-scripts)

---

## 🎯 About

**Zapetrol** is a modern web application designed to help users find and compare real-time fuel prices at gas stations across Spain. Built with **React**, **TypeScript**, and **Vite**, it provides an intuitive and responsive interface for discovering the best fuel prices near you.

---

## ✨ Key Features

- 🗺️ **Interactive Map** - Mapbox GL integration for visualizing gas stations
- 📍 **Auto-Geolocation** - Automatic location detection with Zaragoza fallback
- 🎯 **Radius Search** - Find stations within 5km of your location
- 💰 **Price Comparison** - Compare prices against national averages
- 🔖 **Favorites System** - Save your preferred gas stations
- 🎨 **Color-Coded Markers** - Visual price indicators (green=cheap, red=expensive)
- 📱 **Responsive Design** - Optimized for mobile and desktop
- 🌓 **Modern Dark/Light Theme** - Beautiful gradient design
- 🔐 **JWT Authentication** - Secure user login system
- 👤 **Admin Panel** - User management dashboard

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 20.19+ or 22.12+
- **npm** (comes with Node.js)

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/IsabellaTobon/zapetrol-frontend.git
cd zapetrol-frontend
```

### 2. Install dependencies

```bash
npm install
```

---

## ⚙️ Configuration

Create a `.env` file in the project root:

```env
# Backend URL
VITE_API_URL=http://localhost:3000/server

# Mapbox token (get yours at https://mapbox.com)
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

---

## 🏃 Running the Project

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Mode

```bash
npm run build
npm run preview
```

---

## 🎯 Features

### 🔐 Authentication

- User registration with validation
- JWT-based login system
- Password strength indicator
- Persistent session with localStorage

### 🗺️ Station Visualization

- **Map View** (desktop): Interactive map with markers
- **List View** (mobile/desktop): Cards with filters and pagination
- **Mobile Toggle**: Switch between map and list views
- **Auto-Geolocation**: Detects your location automatically
- **Smart Fallback**: Shows Zaragoza if location unavailable or outside Spain

### 🔍 Filters and Search

- Filter by gas station brand
- Filter by fuel type (Gasoline 95/98, Diesel, etc.)
- Sort by price (ascending/descending)
- Sort by name (A-Z, Z-A)

### ❤️ Favorites

- Save favorite gas stations
- View all saved stations
- Backend synchronization

### 👨‍💼 Admin Panel

- View registered users
- Edit user roles (admin/user)
- Delete users
- Admin-only access

---

## 📁 Project Structure

```
src/
├── assets/          # Images and static resources
├── components/      # Reusable components
│   ├── layout/     # Navbar, Footer
│   ├── stations/   # StationCard, StationList, MapView, Filters
│   └── ui/         # Modal, Pagination, PasswordStrength
├── contexts/        # Context API (Auth, AuthModal)
├── hooks/           # Custom hooks (useAuth, useFavorites)
├── lib/             # Utilities and API client
├── pages/           # Main pages (Home, Favorites, AdminPanel)
└── styles/          # CSS and theme.css with global variables
```

---

## 🎨 Design System

The project features a modern design system with:

- **Centralized CSS Variables** in `theme.css`
- **Reusable Components** (`.gradient-heading-h1`, `.loading-spinner`, etc.)
- **Brand Gradients**: Violet to blue (`#8a5fe8` → `#5d5fef`)
- **Dark Theme** with `#1a1d29` backgrounds and opacity-based text
- **Smooth Transitions** on all interactive elements
- **Glass Morphism** effects on cards and modals

---

## 📱 Responsive Views

### Desktop (>768px)
- Map on top, station list below
- Sidebar with filters
- Grid cards (2-3 columns)

### Mobile (<768px)
- Toggle between map/list views
- Filters in modal/collapse
- Single column cards
- Simplified navigation

---

## 🚦 Geolocation Flow

```
1. Page loads
   ↓
2. Shows Zaragoza stations immediately
   ↓
3. Requests geolocation (8s timeout)
   ↓
   ├─ User ACCEPTS → Updates to their location
   ├─ User DENIES → Shows "Enable Location" button
   └─ Outside Spain → Message + keeps Zaragoza
```

---

## 🔧 Technologies

- **React 18** - UI Library
- **TypeScript** - Static typing
- **Vite** - Ultra-fast build tool
- **React Router** - SPA navigation
- **Mapbox GL** - Interactive maps
- **Axios** - HTTP client
- **CSS Modules** - Modular styling

---

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

---

## 📄 License

This project is part of a Master's Thesis (TFM - Trabajo Fin de Máster).

---

<div align="center">

**Built with ⛽ for smarter fuel decisions**

</div>
