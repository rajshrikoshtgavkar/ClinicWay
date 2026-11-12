import { SideNavItem } from "@/Types";
import {
  IconHome,
  IconUsers,
  IconCalendarEvent,
  IconStethoscope,
  IconSettings,
} from "@tabler/icons-react";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Dashboard",
    path: "/staff/dashboard",
    icon: <IconHome size={28} />,
  },
  {
    title: "Manage Appointments",
    path: "/staff/appointments",
    icon: <IconCalendarEvent size={28} />,
  },
  {
    title: "Doctors",
    path: "/staff/doctors",
    icon: <IconStethoscope size={28} />,
  },
  {
    title: "Settings",
    path: "/staff/profile",
    icon: <IconSettings size={28} />,
  },
];
