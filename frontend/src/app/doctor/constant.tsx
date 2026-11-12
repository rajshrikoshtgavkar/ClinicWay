import { SideNavItem } from "@/Types";
import {
  IconHome,
  IconCalendarTime,
  IconUsers,
  IconReportMedical,
  IconUser,
} from "@tabler/icons-react";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Dashboard",
    path: "/doctor/dashboard",
    icon: <IconHome size={28} />,
  },
  {
    title: "Appointments",
    path: "/doctor/appointments",
    icon: <IconUsers size={28} />,
  },
  {
    title: "Profile",
    path: "/doctor/profile",
    icon: <IconUser size={28} />,
  },
];
