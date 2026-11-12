import { SideNavItem } from "@/Types";
import {
  IconHome,
  IconCalendarPlus,
  IconClipboardList,
  IconUser,
  IconReportMedical,
  IconHospital,
} from "@tabler/icons-react";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Dashboard",
    path: "/patient/dashboard",
    icon: <IconHome size={28} />,
  },
  {
    title: "Find Clinics",
    path: "/patient/clinics",
    icon: <IconHospital size={28} />,
  },
  {
    title: "My Appointments",
    path: "/patient/appointments",
    icon: <IconClipboardList size={28} />,
  },
  // {
  //   title: "Medical Records",
  //   path: "/patient/records",
  //   icon: <IconReportMedical size={28} />,
  // },
  {
    title: "Profile",
    path: "/patient/profile",
    icon: <IconUser size={28} />,
  },
];
