export type RoomStatus =
  | "AVAILABLE"
  | "OCCUPIED"
  | "RESERVED"
  | "CLEANING"
  | "MAINTENANCE"
  | "OUT_OF_SERVICE";

export type RoomTypeCategory =
  | "ROOM"
  | "COTTAGE"
  | "TENT"
  | "CAMPING_SITE"
  | "CONFERENCE_HALL";

export interface RoomTypeAmenity {
  roomTypeId: string;
  amenityId: string;
  amenity: {
    id: string;
    name: string;
    description?: string | null;
  };
}

export interface RoomType {
  id: string;
  tenantId: string;
  name: string;
  category: RoomTypeCategory;
  description: string | null;
  imageUrl: string | null;
  capacity: number;
  basePrice: number | string;
  size: number | null;
  bedType: string | null;
  maxAdults: number | null;
  maxChildren: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  amenities?: RoomTypeAmenity[];
}

export interface Room {
  id: string;
  tenantId: string;
  roomTypeId: string;
  roomNumber: string;
  floor: string | null;
  status: RoomStatus;
  price: number | string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  roomType: RoomType;
}

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
  status?: RoomStatus;
  notes?: string;
  isActive?: boolean;
}

export interface CreateRoomTypeDto {
  name: string;
  category: RoomTypeCategory;
  description?: string;
  capacity: number;
  basePrice: number;
  isActive?: boolean;
}

export interface UpdateRoomTypeDto {
  name?: string;
  category?: RoomTypeCategory;
  description?: string;
  capacity?: number;
  basePrice?: number;
  isActive?: boolean;
}

export interface RoomFilters {
  status?: RoomStatus;
  roomTypeId?: string;
  floor?: string;
}