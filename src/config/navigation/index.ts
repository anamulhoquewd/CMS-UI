interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType;
}

import { getStorage } from "@/store/local";
import { decodeJwtPayload } from "@/utils/helper";
import {
  BarChart3,
  Users,
  ShoppingCart,
  CreditCard,
  Settings,
  Home,
} from "lucide-react";

const token = getStorage("accessToken");
const decode = decodeJwtPayload(token as string);

const navItems: NavItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Customers",
    href: "/dashboard/customers",
    icon: Users,
  },
  {
    title: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    title: "Payments",
    href: "/dashboard/payments",
    icon: CreditCard,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

if (decode?.role === "super_admin")
  navItems.splice(1, 0, {
    title: "Users",
    href: "/dashboard/users",
    icon: Users,
  });

export { navItems };
