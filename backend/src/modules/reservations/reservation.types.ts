import {
  BookingSource,
  ReservationStatus,
} from "@prisma/client";

export interface CreateReservationDto {
  guestId: string;
  roomId: string;

  checkInDate: Date;
  checkOutDate: Date;

  adults?: number;
  children?: number;

  source?: BookingSource;

  notes?: string;
}

export interface UpdateReservationDto {
  guestId?: string;
  roomId?: string;

  checkInDate?: Date;
  checkOutDate?: Date;

  adults?: number;
  children?: number;

  status?: ReservationStatus;

  source?: BookingSource;

  notes?: string;
}