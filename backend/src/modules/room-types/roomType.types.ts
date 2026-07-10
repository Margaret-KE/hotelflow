export interface CreateRoomTypeDto {
  name: string;
  category:
    | "ROOM"
    | "COTTAGE"
    | "TENT"
    | "CAMPING_SITE"
    | "CONFERENCE_HALL";

  description?: string;

  capacity: number;

  basePrice: number;

  isActive?: boolean;
}

export type UpdateRoomTypeDto = Partial<CreateRoomTypeDto>;