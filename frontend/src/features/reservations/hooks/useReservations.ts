import { useCallback, useEffect, useState } from "react";

import { reservationService } from "../services/reservation.service";
import type { Reservation } from "../types/reservation.types";

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshReservations = useCallback(async () => {
    try {
      setLoading(true);

      const data =
        await reservationService.getReservations();

      setReservations(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshReservations();
  }, [refreshReservations]);

  const createReservation = async (
    data: Parameters<
      typeof reservationService.createReservation
    >[0]
  ) => {
    await reservationService.createReservation(data);

    await refreshReservations();
  };

  const updateReservation = async (
    id: string,
    data: Parameters<
      typeof reservationService.updateReservation
    >[1]
  ) => {
    await reservationService.updateReservation(
      id,
      data
    );

    await refreshReservations();
  };

  const checkInReservation = async (
    id: string
  ) => {
    await reservationService.checkInReservation(id);

    await refreshReservations();
  };

  const checkOutReservation = async (
    id: string
  ) => {
    await reservationService.checkOutReservation(id);

    await refreshReservations();
  };

  const cancelReservation = async (
    id: string
  ) => {
    await reservationService.cancelReservation(id);

    await refreshReservations();
  };

  const noShowReservation = async (
    id: string
  ) => {
    await reservationService.noShowReservation(id);

    await refreshReservations();
  };

  return {
    reservations,
    loading,
    refreshReservations,
    createReservation,
    updateReservation,
    checkInReservation,
    checkOutReservation,
    cancelReservation,
    noShowReservation,
  };
}