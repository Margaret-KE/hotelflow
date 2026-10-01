import api from "../../../api/axios";

import type {
  CreateRoomDto,
  Room,
  RoomFilters,
  UpdateRoomDto,
} from "../types/room.types";

export const roomService = {
  async getRooms(filters: RoomFilters = {}): Promise<Room[]> {
    const response = await api.get("/rooms", {
      params: filters,
    });

    return response.data.data;
  },

  async getRoom(id: string): Promise<Room> {
    const response = await api.get(`/rooms/${id}`);

    return response.data.data;
  },

  async createRoom(data: CreateRoomDto): Promise<Room> {
    const response = await api.post("/rooms", data);

    return response.data.data;
  },

  async updateRoom(
    id: string,
    data: UpdateRoomDto
  ): Promise<Room> {
    const response = await api.put(`/rooms/${id}`, data);

    return response.data.data;
  },

  async deleteRoom(id: string): Promise<void> {
    await api.delete(`/rooms/${id}`);
  },
};