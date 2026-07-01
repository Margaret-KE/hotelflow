import {
  BedDouble,
  CalendarCheck2,
  CreditCard,
  UtensilsCrossed,
  Beer,
  Building2,
  Tent,
  TrendingUp,
} from "lucide-react";

import type { Stat } from "../types/stat";

export const DASHBOARD_STATS: Stat[] = [
  {
    title: "Occupancy",
    value: "86%",
    subtitle: "Today's occupancy",
    icon: BedDouble,
  },
  {
    title: "Check-ins",
    value: "24",
    subtitle: "Expected today",
    icon: CalendarCheck2,
  },
  {
    title: "Revenue",
    value: "KES 185K",
    subtitle: "Today's revenue",
    icon: CreditCard,
  },
  {
    title: "Restaurant",
    value: "KES 42K",
    subtitle: "Restaurant sales",
    icon: UtensilsCrossed,
  },
  {
    title: "Bar",
    value: "KES 18K",
    subtitle: "Bar sales",
    icon: Beer,
  },
  {
    title: "Conference",
    value: "3",
    subtitle: "Active bookings",
    icon: Building2,
  },
  {
    title: "Camping",
    value: "12",
    subtitle: "Current guests",
    icon: Tent,
  },
  {
    title: "Growth",
    value: "+18%",
    subtitle: "Monthly growth",
    icon: TrendingUp,
  },
];