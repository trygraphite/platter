import {
  BookHeadphones,
  BookMarkedIcon,
  BookOpenText,
  Building2,
  ForkKnifeCrossedIcon,
  HeartCrack,
  LayoutPanelTop,
  PanelTopDashed,
  PencilLine,
  Plus,
  QrCode,
  ScanQrCode,
  SettingsIcon,
  UserCog2,
  UserPlus2,
  Users2,
} from "lucide-react";

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
  {
    name: "Service Point",
    icon: Building2,
    children: [
      {
        name: "Create Service Point",
        url: "/create-service-point",
        icon: Plus,
      },
      {
        name: "Manage Service Point",
        url: "/manage-service-point",
        icon: Building2,
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
