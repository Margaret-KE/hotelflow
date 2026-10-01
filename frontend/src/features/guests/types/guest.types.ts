export type GuestIdType =
  | "NATIONAL_ID"
  | "PASSPORT"
  | "DRIVERS_LICENSE";

export type GuestGender =
  | "MALE"
  | "FEMALE"
  | "OTHER";

export interface Guest {
  id: string;
  tenantId: string;

  firstName: string;
  lastName: string;

  email: string | null;
  phone: string;

  idType: GuestIdType | null;
  idNumber: string | null;

  nationality: string | null;

  gender: GuestGender | null;

  dateOfBirth: string | null;

  address: string | null;
  city: string | null;
  country: string | null;

  emergencyName: string | null;
  emergencyPhone: string | null;

  company: string | null;

  notes: string | null;

  vip: boolean;
  blacklisted: boolean;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface CreateGuestDto {
  firstName: string;
  lastName: string;

  email?: string;
  phone: string;

  idType?: GuestIdType;
  idNumber?: string;

  nationality?: string;

  gender?: GuestGender;

  dateOfBirth?: string;

  address?: string;
  city?: string;
  country?: string;

  emergencyName?: string;
  emergencyPhone?: string;

  company?: string;

  notes?: string;

  vip?: boolean;
  blacklisted?: boolean;
}

export interface UpdateGuestDto {
  firstName?: string;
  lastName?: string;

  email?: string;
  phone?: string;

  idType?: GuestIdType;
  idNumber?: string;

  nationality?: string;

  gender?: GuestGender;

  dateOfBirth?: string;

  address?: string;
  city?: string;
  country?: string;

  emergencyName?: string;
  emergencyPhone?: string;

  company?: string;

  notes?: string;

  vip?: boolean;
  blacklisted?: boolean;
}

export interface GuestFilters {
  vip?: boolean;
  blacklisted?: boolean;
}