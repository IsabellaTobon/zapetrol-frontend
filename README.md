# Zapetrol Frontend

Aplicación web moderna para comparar precios de combustible en España en tiempo real. Construida con **React**, **TypeScript** y **Vite**.

---

## ✨ Características principales

- 🗺️ **Mapa interactivo** con Mapbox GL para visualizar estaciones
- 📍 **Geolocalización** automática con fallback a Zaragoza
- 🎯 **Búsqueda por radio** (5km) desde tu ubicación
- 💰 **Comparación de precios** con la media nacional
- 🔖 **Sistema de favoritos** para guardar tus estaciones
- 🎨 **Marcadores coloreados** según precio (verde=barato, rojo=caro)
- 📱 **Diseño responsive** con vistas móvil y desktop
- 🌓 **Tema oscuro/claro moderno** con gradientes
- 🔐 **Autenticación JWT** con panel de usuario
- 👤 **Panel de administración** para gestionar usuarios

---

## 📋 Requisitos previos

- **Node.js** >= 20.19+ o 22.12+
- **npm**

---

## 🚀 Instalación y configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# URL del backend
VITE_API_URL=http://localhost:3000 / server

# Token de Mapbox (obtener en https://mapbox.com)
VITE_MAPBOX_TOKEN=tu_token_de_mapbox
```

### 3. Ejecutar el proyecto

**Modo desarrollo:**

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

**Modo producción:**

```bash
npm run build
npm run preview
```

---

## 🎯 Funcionalidades

### 🔐 Autenticación

- Registro de nuevos usuarios con validación
- Login con JWT
- Indicador de fortaleza de contraseña
- Sesión persistente con localStorage

### 🗺️ Visualización de estaciones

- **Vista de mapa** (desktop): Mapa interactivo con marcadores
- **Vista de lista** (móvil/desktop): Cards con filtros y paginación
- **Toggle móvil**: Cambiar entre mapa y lista
- **Geolocalización**: Detecta tu ubicación automáticamente
- **Fallback**: Muestra Zaragoza si no hay ubicación o estás fuera de España

### 🔍 Filtros y búsqueda

- Por marca de gasolinera
- Por tipo de combustible (Gasolina 95/98, Diesel, etc.)
- Ordenar por precio (ascendente/descendente)
- Ordenar por nombre (A-Z, Z-A)

### ❤️ Favoritos

- Guardar estaciones favoritas
- Ver todas tus estaciones guardadas
- Sincronización con el backend

### 👨‍💼 Panel de administración

- Ver lista de usuarios registrados
- Editar roles (admin/user)
- Eliminar usuarios
- Solo accesible para administradores

---

## 📁 Estructura del proyecto

```
src/
├── assets/              # Imágenes y recursos estáticos
├── components/          # Componentes reutilizables
│   ├── layout/         # Navbar, Footer
│   ├── stations/       # StationCard, StationList, MapView, Filters
│   └── ui/             # Modal, Pagination, PasswordStrength
├── contexts/           # Context API (Auth, AuthModal)
├── hooks/              # Custom hooks (useAuth, useFavorites)
├── lib/                # Utilidades y API client
├── pages/              # Páginas principales (Home, Favorites, AdminPanel)
└── styles/             # CSS y theme.css con variables globales
```

---

## 🎨 Sistema de diseño

El proyecto utiliza un sistema de diseño moderno con:

- **Variables CSS** centralizadas en `theme.css`
- **Componentes reutilizables** (`.gradient-heading-h1`, `.loading-spinner`, etc.)
- **Gradientes de marca**: Violeta a azul (`#8a5fe8` → `#5d5fef`)
- **Tema oscuro** con fondos `#1a1d29` y textos con opacidad
- **Transiciones suaves** en todos los elementos
- **Glass morphism** en cards y modales

---

## 🛠️ Scripts disponibles

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Compila para producción
- `npm run preview` - Previsualiza build de producción
- `npm run lint` - Ejecuta ESLint

---

## 🔧 Tecnologías utilizadas

- **React 18** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool ultrarrápido
- **React Router** - Navegación SPA
- **Mapbox GL** - Mapas interactivos
- **Axios** - Cliente HTTP
- **CSS Modules** - Estilos modulares

---

## 📱 Vistas responsive

### Desktop (>768px)

- Mapa arriba, lista de estaciones abajo
- Sidebar con filtros
- Cards en grid 2-3 columnas

### Móvil (<768px)

- Toggle entre vista mapa/lista
- Filtros en modal/collapse
- Cards en columna única
- Navegación simplificada

---

## 🚦 Flujo de geolocalización

```
1. Carga de página
   ↓
2. Muestra estaciones de Zaragoza inmediatamente
   ↓
3. Solicita geolocalización (timeout 8s)
   ↓
   ├─ Usuario ACEPTA → Actualiza a su ubicación
   ├─ Usuario DENIEGA → Muestra botón "Activar ubicación"
   └─ Fuera de España → Mensaje + mantiene Zaragoza
```

---

## 📄 Licencia

Este proyecto es parte de un TFM (Trabajo Fin de Máster).

---
