import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000",
  withCredentials: true,
});

// Adjunta el token si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export type MePayload = {
  sub: number;
  email: string;
  role: "user" | "admin";
  name?: string;
  iat: number;
  exp: number;
};

export type User = {
  id: number;
  email: string;
  name?: string;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
};

export type UpdateUserDto = {
  email?: string;
  name?: string;
  role?: "user" | "admin";
  password?: string;
};

export async function loginAPI(input: { email: string; password: string }) {
  const { data } = await api.post<{ access_token: string }>(
    "/auth/login",
    input
  );
  return data;
}
export async function registerAPI(input: {
  email: string;
  password: string;
  name?: string;
}) {
  const { data } = await api.post<{ access_token: string }>(
    "/auth/register",
    input
  );
  return data;
}
export async function meAPI() {
  const { data } = await api.get<MePayload>("/auth/me");
  return data;
}

// === ADMIN ENDPOINTS ===

export async function getAllUsersAPI() {
  const { data } = await api.get<User[]>("/admin/users");
  return data;
}

export async function getUserByIdAPI(id: number) {
  const { data } = await api.get<User>(`/admin/users/${id}`);
  return data;
}

export async function updateUserAPI(id: number, input: UpdateUserDto) {
  const { data } = await api.put<User>(`/admin/users/${id}`, input);
  return data;
}

export async function deleteUserAPI(id: number) {
  await api.delete(`/admin/users/${id}`);
}

// === STATION ENDPOINTS ===

export type StationDetails = {
  stationId: number;
  stationName: string;
  longitude: number;
  latitude: number;
  side: string;
  postalCode: string;
  address: string;
  openingHours: string;
  saleType: string;
  municipalityId: number;
  lastUpdate: string;
  locality: string;
  Gasoline95?: number;
  Gasoline95_avg?: number;
  Gasoline98?: number;
  Gasoline98_avg?: number;
  Diesel?: number;
  Diesel_avg?: number;
  DieselPremium?: number;
  DieselPremium_avg?: number;
  DieselB_avg?: number;
  LPG_avg?: number;
  province: string;
  provinceDistrict: string;
  brand: string;
};

export type StationByMunicipality = {
  stationId: number;
  name: string;
  address: string;
  municipalityId: number;
  latitude: number;
  longitude: number;
};

export type StationInRadius = {
  id: string;
  stationId?: number;
  name: string;
  coordinates: { type: string; coordinates: number[] };
  distance: number;
  province: string;
  locality: string;
};

export async function getStationDetailsAPI(stationId: number) {
  const { data } = await api.get(`/estaciones/detalles/${stationId}`);
  return data;
}

export async function getStationHistoryAPI(
  stationId: number,
  start?: string,
  end?: string
) {
  const { data } = await api.get(`/estaciones/historico/${stationId}`, {
    params: { inicio: start, fin: end },
  });
  return data;
}

export async function getStationsByMunicipalityAPI(municipalityId: number) {
  const { data } = await api.get(`/estaciones/municipio/${municipalityId}`);
  return data;
}

export async function getStationsInRadiusAPI(
  latitude: number,
  longitude: number,
  radius: number,
  page?: number,
  limit?: number
) {
  const { data } = await api.get(`/estaciones/radio`, {
    params: {
      latitud: latitude,
      longitud: longitude,
      radio: radius,
      page,
      limit,
    },
  });
  return data;
}

export async function getStationsInRadiusWithDetailsAPI(
  latitude: number,
  longitude: number,
  radius: number,
  page?: number,
  limit?: number
): Promise<StationDetails[]> {
  const { data } = await api.get(`/estaciones/radio/detalles`, {
    params: {
      latitud: latitude,
      longitud: longitude,
      radio: radius,
      page,
      limit,
    },
  });
  return data;
}

// === FAVORITES ENDPOINTS ===

export async function getFavoritesAPI(): Promise<number[]> {
  const { data } = await api.get("/favorites");
  return data;
}

export async function toggleFavoriteAPI(
  stationId: number
): Promise<{ favorites: number[]; added: boolean }> {
  const { data } = await api.post(`/favorites/${stationId}`);
  return data;
}
