import * as React from "react";
import { NavFooter } from "@/components/nav-footer";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Link, usePage } from "@inertiajs/react";
import { LayoutGrid, Banknote, Coins, User, Folder } from "lucide-react";
import AppLogoIcon from "@/components/app-logo-icon";
import { LinkNavItem } from "@/types/shared";

interface NavItem {
  title: string;
  icon: React.ElementType;
  href: string;
}

const customerNavItems: NavItem[] = [
  {
    title: "Dashboard",
    icon: LayoutGrid,
    href: "/customer/dashboard",
  },
  {
    title: "Loan",
    icon: Banknote,
    href: "/my-loan",
  },
  {
    title: "Repayments",
    icon: Coins,
    href: "/my-repayments",
  },
  {
    title: "Profile",
    icon: User,
    href: "/my-profile",
  },
];

const footerNavItems: LinkNavItem[] = [
  { type: "link", title: "Repository", href: "https://github.com/jcaMx/jamo-lending-system", icon: Folder },
];


export default function CustomerSidebar() {
  const { url } = usePage();

  return (
    <Sidebar
      collapsible="offcanvas"
      className="bg-[#192132] w-64 text-white flex flex-col border-none shrink-0 "
    >
      {/* HEADER */}
      <SidebarHeader className="bg-[#192132] p-4">
        <Link href="/customer/dashboard" className="flex items-center gap-2">
          <AppLogoIcon className="h-10 w-auto" />
        </Link>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent className="px-4 py-6 flex-1 overflow-y-auto">
        <div className="space-y-1.5">
          {customerNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = url === item.href;

            return (
              <Link
                key={item.title}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive
                    ? "bg-linear-to-r from-[#3c4a6a] to-[#192132]"
                    : "hover:bg-linear-to-r hover:from-[#2f3b57] hover:to-[#192132]" 
                  }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-[#FABF24]" : "text-gray-400"}`} />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </div>
      </SidebarContent>

      {/* FOOTER  */}
      <SidebarFooter className="bg-[#192132] text-white">
        <NavFooter items={footerNavItems} className="mt-auto" />
        <NavUser />
      </SidebarFooter>
    </Sidebar>

  );
}
