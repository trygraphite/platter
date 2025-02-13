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
    name: "Qr Code",
    url: "/qr",
    icon: QrCode,
  },
  {
    name: "Feedback",
    icon: Users2,
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
