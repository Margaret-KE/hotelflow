import {
  LayoutDashboard,
  CalendarDays,
  BedDouble,
  Users,
  UtensilsCrossed,
  ChefHat,
  Beer,
  Building2,
  Tent,
  Trees,
  ClipboardList,
  Package,
  BarChart3,
  Settings,
} from "lucide-react";

import { ROUTES } from "./routes";

export const navigation = [
  {
    section: "GENERAL",
    items: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        path: ROUTES.DASHBOARD,
      },
    ],
  },
  {
    section: "FRONT OFFICE",
    items: [
      {
        title: "Reservations",
        icon: CalendarDays,
        path: ROUTES.RESERVATIONS,
      },
      {
        title: "Rooms",
        icon: BedDouble,
        path: ROUTES.ROOMS,
      },
      {
        title: "Guests",
        icon: Users,
        path: ROUTES.GUESTS,
      },
    ],
  },
  {
    section: "FOOD & BEVERAGE",
    items: [
      {
        title: "Restaurant POS",
        icon: UtensilsCrossed,
        path: ROUTES.RESTAURANT,
      },
      {
        title: "Kitchen Display",
        icon: ChefHat,
        path: "/kitchen",
      },
      {
        title: "Bar POS",
        icon: Beer,
        path: ROUTES.BAR,
      },
    ],
  },
  {
    section: "EVENTS & LEISURE",
    items: [
      {
        title: "Conference",
        icon: Building2,
        path: ROUTES.CONFERENCE,
      },
      {
        title: "Camping",
        icon: Tent,
        path: ROUTES.CAMPING,
      },
      {
        title: "Guest Activities",
        icon: Trees,
        path: ROUTES.ACTIVITIES,
      },
    ],
  },
  {
    section: "OPERATIONS",
    items: [
      {
        title: "Housekeeping",
        icon: ClipboardList,
        path: ROUTES.HOUSEKEEPING,
      },
      {
        title: "Inventory",
        icon: Package,
        path: ROUTES.INVENTORY,
      },
    ],
  },
  {
    section: "FINANCE",
    items: [
      {
        title: "Reports",
        icon: BarChart3,
        path: ROUTES.REPORTS,
      },
    ],
  },
  {
    section: "ADMINISTRATION",
    items: [
      {
        title: "Settings",
        icon: Settings,
        path: ROUTES.SETTINGS,
      },
    ],
  },
];