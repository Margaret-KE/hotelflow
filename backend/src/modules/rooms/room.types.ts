export interface CreateRoomDto {
  roomNumber: string;
  roomTypeId: string;
  floor?: string;
  notes?: string;
}

export interface UpdateRoomDto {
  roomNumber?: string;
  roomTypeId?: string;
  floor?: string;
  status?:
    | "AVAILABLE"
    | "OCCUPIED"
    | "RESERVED"
    | "CLEANING"
    | "MAINTENANCE"
    | "OUT_OF_SERVICE";
  notes?: string;
  isActive?: boolean;
}