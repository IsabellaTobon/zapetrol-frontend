# zapetrol-frontend

## Configuración

### Variables de entorno

Crea un archivo `.env` en la raíz del proyecto (puedes copiar `.env.example`):

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_MAPBOX_TOKEN=tu_token_de_mapbox
```

#### Obtener token de Mapbox

1. Ve a [mapbox.com](https://www.mapbox.com/)
2. Crea una cuenta gratuita
3. En tu dashboard, encontrarás tu token de acceso
4. Copia el token y pégalo en la variable `VITE_MAPBOX_TOKEN`

El plan gratuito incluye 50,000 cargas de mapa al mes, suficiente para desarrollo.

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

## Características

- 🗺️ **Vista de mapa interactivo** con react-map-gl
- 📋 **Vista de lista** con filtros y paginación
- 📍 **Geolocalización** para mostrar estaciones cercanas
- 🎨 **Marcadores coloreados** según el precio de combustible
- 💰 **Comparación de precios** con la media
