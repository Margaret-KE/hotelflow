import api from "../../../api/axios";

export const guestService = {
  async getGuests() {
    const response = await api.get("/guests");

    return response.data.data;
  },
};