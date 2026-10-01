import api from "../../../api/axios";

import type {
  CreateRoomTypeDto,
  RoomType,
  UpdateRoomTypeDto,
} from "../types/room.types";

export const roomTypeService = {
  async getRoomTypes(): Promise<RoomType[]> {
    const response = await api.get("/room-types");

    return response.data.data;
  },

  async getRoomType(id: string): Promise<RoomType> {
    const response = await api.get(`/room-types/${id}`);

    return response.data.data;
  },

  async createRoomType(
    data: CreateRoomTypeDto
  ): Promise<RoomType> {
    const response = await api.post("/room-types", data);

    return response.data.data;
  },

  async updateRoomType(
    id: string,
    data: UpdateRoomTypeDto
  ): Promise<RoomType> {
    const response = await api.put(
      `/room-types/${id}`,
      data
    );

    return response.data.data;
  },

  async deleteRoomType(id: string): Promise<void> {
    await api.delete(`/room-types/${id}`);
  },
};