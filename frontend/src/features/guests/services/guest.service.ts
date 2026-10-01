import api from "../../../api/axios";

import type {
  CreateGuestDto,
  Guest,
  UpdateGuestDto,
} from "../types/guest.types";

interface GuestResponse {
  success: boolean;
  data: Guest;
  message?: string;
}

interface GuestsResponse {
  success: boolean;
  data: Guest[];
}

export const guestService = {
  async getGuests(): Promise<Guest[]> {
    const response = await api.get<GuestsResponse>("/guests");

    return response.data.data;
  },

  async getGuest(id: string): Promise<Guest> {
    const response = await api.get<GuestResponse>(
      `/guests/${id}`
    );

    return response.data.data;
  },

  async createGuest(
    data: CreateGuestDto
  ): Promise<Guest> {
    const response = await api.post<GuestResponse>(
      "/guests",
      data
    );

    return response.data.data;
  },

  async updateGuest(
    id: string,
    data: UpdateGuestDto
  ): Promise<Guest> {
    const response = await api.put<GuestResponse>(
      `/guests/${id}`,
      data
    );

    return response.data.data;
  },

  async deleteGuest(id: string): Promise<void> {
    await api.delete(`/guests/${id}`);
  },
};