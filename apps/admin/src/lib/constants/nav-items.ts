import {
  LayoutPanelTop,
  SettingsIcon,
  QrCode,
  PanelTopDashed,
  ForkKnifeCrossedIcon,
  Users2,
  PencilLine,
  HeartCrack,
  BookMarkedIcon,
  PinIcon,
  ScanQrCode,
  LucideScanQrCode,
  BookHeadphones,
  UserPlus2,
  UserCog2,
  BookOpenText,
} from "lucide-react";
import { c } from "node_modules/better-auth/dist/index-4d8GiU4g";

export const items = [
  {
    name: "Dashboard",
    url: "/",
    icon: LayoutPanelTop,
  },
  {
    name: "Orders",
    url: "/orders",
    icon: ForkKnifeCrossedIcon,
  },
  {
    name: "Menu",
    url: "/menu",
    icon: PanelTopDashed,
  },
  {
    name: "QR Code",
    url: "/create-qr",
    icon: QrCode,
    children: [
      {
        name: "Create QR Code",
        url: "/create-qr",
        icon: ScanQrCode,
      },
      {
        name: "Manage QR Code",
        url: "/manage-qr",
        icon: BookHeadphones,
      },
    ],
  },
  {
    name: "Staff Management",
    // url: "/create-staff",
    icon: Users2,
    children: [
      {
        name: "Create Staff",
        url: "/create-staff",
        icon: UserPlus2,
      },
      {
        name: "Manage Staff",
        url: "/manage-staff",
        icon: UserCog2,
      },
    ],
  },
  // {
  //   name: "Location",
  //   url: "/location",
  //   icon: PinIcon,
  // },
  {
    name: "Reports",
    icon: BookOpenText,
    url: "/feedback",
    children: [
      {
        name: "Feedback",
        url: "/feedback",
        icon: BookMarkedIcon,
      },
      {
        name: "Reviews",
        url: "/reviews",
        icon: PencilLine,
      },
      {
        name: "Complaints",
        url: "/complaints",
        icon: HeartCrack,
      },
    ],
  },
  {
    name: "Settings",
    url: "/settings",
    icon: SettingsIcon,
  },
];
