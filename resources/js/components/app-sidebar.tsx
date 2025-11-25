import { NavFooter } from '@/components/nav-footer';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { Link, usePage } from '@inertiajs/react';
import { Folder, LayoutGrid, ChevronDown, ChevronRight } from 'lucide-react';
import AppLogoIcon from './app-logo-icon';
import { BorrowersIcon } from '@/components/icons/BorrowersIcon';
import { UserIcon } from '@/components/icons/UserIcon';
import { LoansIcon } from '@/components/icons/LoansIcon';
import { RepaymentsIcon } from '@/components/icons/RepaymentsIcon';
import { DailyCollectionsIcon } from '@/components/icons/DailyCollectionsIcon';
import { ReportsIcon } from '@/components/icons/ReportsIcon';
import { useState, useEffect } from 'react';

interface BaseNavItem {
  title: string;
  icon?: React.ElementType;
  roles?: string[];
}

interface LinkNavItem extends BaseNavItem {
  type: "link";
  href: string;
}

interface GroupNavItem extends BaseNavItem {
  type: "group";
  subItems: LinkNavItem[];
}

type NavItem = LinkNavItem | GroupNavItem;


const mainNavItems: NavItem[] = [
  { type: "link", title: "Dashboard", icon: LayoutGrid, href: dashboard(), roles: ["admin", "cashier"] },

  {
    type: "group",
    title: "Borrowers",
    icon: BorrowersIcon,
    roles: ["admin", "cashier"],
    subItems: [
      { type: "link", title: "View All Borrowers", href: "/borrowers" },
      { type: "link", title: "Add Borrower", href: "/borrowers/add", roles: ["admin"] },
    ]
  },

  {
    type: "group",
    title: "Loans",
    icon: LoansIcon,
    roles: ["admin", "cashier"],
    subItems: [
      { type: "link", title: "View All Loans", href: "/Loans/VAL" },
      { type: "link", title: "Past Maturity Date", href: "/Loans/PMD" },
      { type: "link", title: "1 Month Late Loans", href: "/Loans/1MLL" },
      { type: "link", title: "3 Month Late Loans", href: "/Loans/3MLL" },
      { type: "link", title: "Add Loan", href: "/Loans/AddLoan", roles: ["admin"] },
      { type: "link", title: "View Loan Applications", href: "/Loans/VLA", roles: ["admin"] },
    ],
  },

  {
    type: "group",
    title: "Repayments",
    icon: RepaymentsIcon,
    roles: ["cashier", "admin"],
    subItems: [
      { type: "link", title: "View Repayments", href: "/repayments" },
      { type: "link", title: "Add Repayment", href: "/repayments/add" },
    ]
  },

  { type: "link", title: "Daily Collection Sheets", icon: DailyCollectionsIcon, href: "/daily-collections", roles: ["cashier", "admin"] },

  {
    type: "group",
    title: "Reports",
    icon: ReportsIcon,
    roles: ["admin"],
    subItems: [
      { type: "link", title: "Daily Cash Position Report", href: "/Reports/DCPR" },
      { type: "link", title: "Monthly Report", href: "/Reports/MonthlyReport" },
    ],
  },

  {
    type: "group",
    title: "System Users",
    icon: UserIcon,
    roles: ["admin"],
    subItems: [
      { type: "link", title: "View Users", href: "/users" },
      { type: "link", title: "Add User", href: "/users/add" },
    ]
  },
];


const footerNavItems: LinkNavItem[] = [
  { type: "link", title: "Repository", href: "https://github.com/jcaMx/jamo-lending-system", icon: Folder },
];


export function AppSidebar() {
  const { url, props } = usePage();
  const userRoles: string[] = props.auth?.roles ?? [];
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const canView = (item: NavItem) => {
    if (!item.roles || item.roles.length === 0) return true;
    return item.roles.some(role => userRoles.includes(role));
  };

  // Auto-open correct group on navigation
  useEffect(() => {
    const newOpenMenus: Record<string, boolean> = {};

    mainNavItems.forEach(item => {
      if (!canView(item)) return;

      if (item.type === "group") {
        const visible = item.subItems.filter(canView);
        if (visible.some(sub => url.startsWith(sub.href))) {
          newOpenMenus[item.title] = true;
        }
      }
    });

    setOpenMenus(newOpenMenus);
  }, [url, userRoles]);

  const toggleMenu = (title: string) => {
    setOpenMenus(prev => ({ ...prev, [title]: !prev[title] }));
  };

  return (
<<<<<<< HEAD
    <Sidebar collapsible="none" variant="floating" className="bg-[#192132] text-white w-64 h-screen flex flex-col">
=======
    <Sidebar collapsible="none" variant="floating" className="bg-[#192132] text-white w-64 min-h-screen overflow-y-auto">
>>>>>>> 3869eaf26b98506d32e24861b6c63faefc1a0448
      
      <SidebarHeader className="bg-[#192132] text-white">
        <Link href={dashboard()}>
          <AppLogoIcon className="m-3" />
        </Link>
      </SidebarHeader>

<<<<<<< HEAD
        <SidebarContent className="px-2 bg-[#192132] text-white flex-1 overflow-y-auto">
        
=======
      <SidebarContent className="px-2 bg-[#192132] text-white">
>>>>>>> 3869eaf26b98506d32e24861b6c63faefc1a0448
        <div className="space-y-2">
          {mainNavItems.filter(canView).map(item => {
            const Icon = item.icon;

            // GROUP ITEM
            if (item.type === "group") {
              const visible = item.subItems.filter(canView);
              const isOpen = openMenus[item.title] ?? false;
              const hasActiveChild = visible.some(sub => url === sub.href);

              return (
                <div key={item.title}>
                  <button
                    onClick={() => toggleMenu(item.title)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition duration-200
<<<<<<< HEAD
                      ${hasActiveChild ? "bg-linear-to-r from-[#3c4a6a] to-[#192132]" :
                        "hover:bg-linear-to-r hover:from-[#2f3b57] hover:to-[#192132]"}`}
=======
                      ${hasActiveChild ? "bg-gradient-to-r from-[#3c4a6a] to-[#192132]" :
                        "hover:bg-gradient-to-r hover:from-[#2f3b57] hover:to-[#192132]"}`}
>>>>>>> 3869eaf26b98506d32e24861b6c63faefc1a0448
                  >
                    <div className="flex items-center gap-3">
                      {Icon && <Icon className="w-5 h-5" />}
                      <span>{item.title}</span>
                    </div>

                    <span className={`transition-transform ${isOpen ? "rotate-90" : ""}`}>
                      {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="ml-6 mt-1 space-y-1">
                      {visible.map(sub => {
                        const active = url === sub.href;

                        return (
                          <Link
                            key={sub.title}
                            href={sub.href}
                            className={`block px-3 py-1.5 rounded-lg text-sm transition duration-200 relative
                              ${active
<<<<<<< HEAD
                                ? "bg-linear-to-r from-[#3c4a6a] to-[#192132] border-l-4 border-gray-400 pl-5"
                                : "hover:bg-linear-to-r hover:from-[#030916] hover:to-[#192132]"
=======
                                ? "bg-gradient-to-r from-[#3c4a6a] to-[#192132] border-l-4 border-gray-400 pl-5"
                                : "hover:bg-gradient-to-r hover:from-[#2f3b57] hover:to-[#192132]"
>>>>>>> 3869eaf26b98506d32e24861b6c63faefc1a0448
                              }`}
                          >
                            {sub.title}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            // LINK ITEM
            const isActiveParent = url === item.href;

            return (
              <Link
                key={item.title}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition duration-200
                  ${isActiveParent
<<<<<<< HEAD
                    ? "bg-linear-to-r from-[#3c4a6a] to-[#192132]"
                    : "hover:bg-linear-to-r hover:from-[#2f3b57] hover:to-[#192132]"
=======
                    ? "bg-gradient-to-r from-[#3c4a6a] to-[#192132]"
                    : "hover:bg-gradient-to-r hover:from-[#2f3b57] hover:to-[#192132]"
>>>>>>> 3869eaf26b98506d32e24861b6c63faefc1a0448
                  }`}
              >
                {Icon && <Icon className="w-5 h-5" />}
                {item.title}
              </Link>
            );
          })}
        </div>
      </SidebarContent>

      <SidebarFooter className="bg-[#192132] text-white">
        <NavFooter items={footerNavItems} className="mt-auto" />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}

