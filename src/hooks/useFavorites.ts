import { useState, useEffect, useCallback } from "react";
import { getFavoritesAPI, toggleFavoriteAPI } from "../lib/api";
import { useAuthContext } from "./useAuthContext";
import { useAuthModal } from "./useAuthModal";
import toast from "react-hot-toast";

export function useFavorites() {
  const { user } = useAuthContext();
  const { openAuthModal } = useAuthModal();
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
        toast.error("Error al actualizar favoritos");
      }
    },
    [user]
  );

  const handleAuthRequired = useCallback(() => {
    openAuthModal();
  }, [openAuthModal]);

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
    handleAuthRequired,
  };
}
