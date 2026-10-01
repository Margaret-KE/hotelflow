import { useCallback, useEffect, useState } from "react";

import { guestService } from "../services/guest.service";

import type {
  Guest,
  GuestFilters,
} from "../types/guest.types";

export const useGuests = (filters: GuestFilters = {}) => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadGuests = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const guestsData = await guestService.getGuests();

      let filteredGuests = guestsData;

      if (filters.vip !== undefined) {
        filteredGuests = filteredGuests.filter(
          (guest) => guest.vip === filters.vip
        );
      }

      if (filters.blacklisted !== undefined) {
        filteredGuests = filteredGuests.filter(
          (guest) => guest.blacklisted === filters.blacklisted
        );
      }

      setGuests(filteredGuests);
    } catch (err) {
      console.error("Failed to load guests:", err);
      setError("Failed to load guests. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadGuests();
  }, [loadGuests]);

  return {
    guests,
    loading,
    error,
    refresh: loadGuests,
  };
};