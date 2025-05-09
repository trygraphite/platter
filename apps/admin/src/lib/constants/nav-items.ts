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
  // {
  //   name: "Location",
  //   url: "/location",
  //   icon: PinIcon,
  // },
  {
    name: "Feedback",
    icon: Users2,
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
