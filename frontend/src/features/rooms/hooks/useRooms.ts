import { useCallback, useEffect, useState } from "react";

import { roomService } from "../services/room.service";
import { roomTypeService } from "../services/roomType.service";

import type {
  Room,
  RoomFilters,
  RoomType,
} from "../types/room.types";

export const useRooms = (filters: RoomFilters = {}) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRooms = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [roomsData, roomTypesData] = await Promise.all([
        roomService.getRooms(filters),
        roomTypeService.getRoomTypes(),
      ]);

      setRooms(roomsData);
      setRoomTypes(roomTypesData);
    } catch (err) {
      console.error("Failed to load rooms:", err);
      setError("Failed to load rooms. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  return {
    rooms,
    roomTypes,
    loading,
    error,
    refresh: loadRooms,
  };
};