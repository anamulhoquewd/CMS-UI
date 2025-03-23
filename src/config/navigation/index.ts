interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType;
}

import {
  BarChart3,
  Users,
  ShoppingCart,
  CreditCard,
  Settings,
  Home,
} from "lucide-react";
export const navItems: NavItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: Home,
  },

  {
    title: "Users",
    href: "/dashboard/users",
    icon: Users,
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
