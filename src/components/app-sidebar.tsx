"use client";

import * as React from "react";
import {
  Icon,
  IconChartBar,
  IconDashboard,
  IconFileDollar,
  IconGitPullRequest,
  IconListDetails,
  IconPlus,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
// import { auth } from "@/auth";
import { useSession } from "next-auth/react";
import Link from "next/link";

const adminBar: {
  title: string;
  url: string;
  icon?: Icon;
}[] = [
  {
    title: "Dashboard",
    url: "/dashboard/admin",
    icon: IconDashboard,
  },
  {
    title: "Create Review",
    url: "/dashboard/admin/create-review",
    icon: IconListDetails,
  },
  {
    title: "Analytics",
    url: "#",
    icon: IconChartBar,
  },
  {
    title: "Review Requests",
    url: "/dashboard/admin/review-request",
    icon: IconGitPullRequest,
  },
];
const userBar: {
  title: string;
  url: string;
  icon?: Icon;
}[] = [
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
    icon: IconPlus,
  },
  {
    title: "Payment History",
    url: "/dashboard/user/payment-history",
    icon: IconFileDollar,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data, status } = useSession();
  if (status === "loading") return <div>Loading...</div>;
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <p className="border border-b-2 font-semibold mr-4 playwrite-ro text-3xl">
                  Opinia
                </p>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={
            data?.user?.role.toLowerCase() === "admin" ? adminBar : userBar
          }
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: (data?.user?.name as string) || "--",
            email: (data?.user?.email as string) || "--",
            avatar: (data?.user?.image as string) || "--",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
