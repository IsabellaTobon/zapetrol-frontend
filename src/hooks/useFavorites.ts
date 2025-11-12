import { useState, useEffect, useCallback } from "react";
import { getFavoritesAPI, toggleFavoriteAPI } from "../lib/api";
import { useAuthContext } from "./useAuthContext";

export function useFavorites() {
  const { user } = useAuthContext();
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const data = await getFavoritesAPI();
      setFavorites(data);
    } catch (error) {
      console.error("Error loading favorites:", error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = useCallback(
    async (stationId: number) => {
      if (!user) return;

      try {
        const { favorites: newFavorites } = await toggleFavoriteAPI(stationId);
        setFavorites(newFavorites);
      } catch (error) {
        console.error("Error toggling favorite:", error);
      }
    },
    [user]
  );

  const isFavorite = useCallback(
    (stationId: number) => {
      return favorites.includes(stationId);
    },
    [favorites]
  );

  return {
    favorites,
    loading,
    toggleFavorite,
    isFavorite,
    isAuthenticated: !!user,
  };
}
