import {
  BedDouble,
  CalendarDays,
  UtensilsCrossed,
  Beer,
  Building2,
  Tent,
  Mountain,
  Package,
  CreditCard,
  BarChart3,
  Users,
  ShieldCheck,
} from "lucide-react";

import type { Feature } from "../types/feature";

export const FEATURES: Feature[] = [
  {
    title: "Room Management",
    description: "Manage rooms, pricing and availability.",
    icon: BedDouble,
  },
  {
    title: "Reservations",
    description: "Track bookings from reservation to checkout.",
    icon: CalendarDays,
  },
  {
    title: "Restaurant POS",
    description: "Process restaurant orders quickly and accurately.",
    icon: UtensilsCrossed,
  },
  {
    title: "Bar POS",
    description: "Manage bar sales and beverage inventory.",
    icon: Beer,
  },
  {
    title: "Conference Booking",
    description: "Schedule and manage conference facilities.",
    icon: Building2,
  },
  {
    title: "Camping",
    description: "Handle camping bookings and guest management.",
    icon: Tent,
  },
  {
    title: "Activities",
    description: "Manage guest activities and experiences.",
    icon: Mountain,
  },
  {
    title: "Inventory",
    description: "Track stock across all hotel departments.",
    icon: Package,
  },
  {
    title: "Payments",
    description: "Support Cash and M-Pesa payment processing.",
    icon: CreditCard,
  },
  {
    title: "Reports",
    description: "Generate operational and financial insights.",
    icon: BarChart3,
  },
  {
    title: "Staff Management",
    description: "Manage employees and user accounts.",
    icon: Users,
  },
  {
    title: "Role-Based Access",
    description: "Secure access with roles and permissions.",
    icon: ShieldCheck,
  },
];