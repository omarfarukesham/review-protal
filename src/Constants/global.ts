import { IconDashboard, IconListDetails } from "@tabler/icons-react";
import {
  BadgeDollarSign,
  ListCollapse,
} from "lucide-react";

export const userBar = [
  {
    title: "Dashboard",
    url: "/dashboard/user/profile",
    icon: IconDashboard,
  },
  {
    title: "My Reviews",
    url: "/dashboard/user/my-reviews",
    icon: IconListDetails,
  },
  {
    title: "Create Review",
    url: "/dashboard/user/create-review",
    icon: ListCollapse,
  },
  {
    title: "Payment History",
    url: "/dashboard/user/payment-history",
    icon: BadgeDollarSign,
  },
];
