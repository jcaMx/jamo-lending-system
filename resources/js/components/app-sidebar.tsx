import { NavFooter } from '@/components/nav-footer';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
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



const mainNavItems: NavItem[] = [
    { title: 'Dashboard', icon: LayoutGrid, href: dashboard().url },
    {
        title: 'Borrowers',
        icon: BorrowersIcon,
        subItems: [
            { title: 'View All Borrowers', href: '/borrowers' },
            { title: 'Add Borrower', href: '/borrowers/add' },
        ],
    },
    {
        title: 'Loans',
        icon: LoansIcon,
        subItems: [
            { title: 'View All Loans', href: '/Loans/VAL' },
            { title: 'Past Maturity Date', href: '/Loans/PMD' },
            { title: '1 Month Late Loans', href: '/Loans/1MLL' },
            { title: '3 Month Late Loans', href: '/Loans/3MLL' },
            { title: 'Add Loan', href: '/Loans/AddLoan' },
            { title: 'View Loan Applications', href: '/Loans/VLA' },
        ],
    },
    {
        title: 'Repayments',
        icon: RepaymentsIcon,
        subItems: [
            { title: 'View Repayments', href: '/repayments' },
            { title: 'Add Repayment', href: '/repayments/add' },
        ],
    },
    { title: 'Daily Collection Sheet', icon: DailyCollectionsIcon, href: '/daily-collections' },
    {
        title: 'Reports',
        icon: ReportsIcon,
        subItems: [
            { title: 'Daily Cash Position Report', href: '/Reports/DCPR' },
            { title: 'Monthly Report', href: '/Reports/MonthlyReport' },
            { title: 'Income Statement Report', href: '/Reports/IncomeStatementReport' },
        ],
    },
    {
        title: 'System Users',
        icon: UserIcon,
        subItems: [
            { title: 'View Users', href: '/users' },
            { title: 'Add User', href: '/users/add' },
        ],
    },
];

const footerNavItems: NavItem[] = [
    { title: 'Repository', href: 'https://github.com/laravel/react-starter-kit', icon: Folder },
];

export function AppSidebar() {
    const { url } = usePage();
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

    // Open parent menus if current URL matches a subitem
    useEffect(() => {
        const newOpenMenus: Record<string, boolean> = {};
        mainNavItems.forEach((item) => {
            if (item.subItems?.some((s) => url.startsWith(s.href))) {
                newOpenMenus[item.title] = true;
            }
        });
        setOpenMenus(newOpenMenus);
    }, [url]);

    const toggleMenu = (title: string) => {
        setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
    };

    return (
        <Sidebar
  collapsible="icon"
  variant="inset"
  className="bg-[#192132] text-white w-64 min-h-screen overflow-y-auto"
>

            <SidebarHeader className="bg-[#192132] text-white">
                <Link href={dashboard().url}>
                    <AppLogoIcon className="m-3" />
                </Link>
            </SidebarHeader>

            <SidebarContent className="px-2 bg-[#192132] text-white">
                <div className="space-y-2">
                    {mainNavItems.map((item) => {
  const isOpen = openMenus[item.title] ?? false;
  const isActiveParent = item.href && url === item.href;
  const hasActiveChild = item.subItems?.some((s) => url === s.href) ?? false;

  // ✅ Narrow the icon type before rendering
  const Icon = item.icon;

  if (item.subItems) {
    return (
      <div key={item.title}>
        {/* Parent */}
        <button
          onClick={() => toggleMenu(item.title)}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition duration-200
            ${isActiveParent || hasActiveChild
              ? 'bg-gradient-to-r from-[#3c4a6a] to-[#192132]'
              : 'hover:bg-gradient-to-r hover:from-[#2f3b57] hover:to-[#192132]'
            }`}
        >
          <div className="flex items-center gap-3">
            {Icon && <Icon className="w-5 h-5" />} {/* ✅ safe rendering */}
            <span>{item.title}</span>
          </div>
          <span className={`transition-transform ${isOpen ? 'rotate-90' : ''}`}>
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </span>
        </button>

        {/* Subitems */}
        {isOpen && (
          <div className="ml-6 mt-1 space-y-1">
            {item.subItems.map((sub) => {
              const isActiveSub = url === sub.href;
              const SubIcon = sub.icon;
              return (
                <Link
                  key={sub.title}
                  href={sub.href}
                  className={`block px-3 py-1.5 rounded-lg text-sm transition duration-200 relative
                    ${isActiveSub
                      ? 'bg-gradient-to-r from-[#3c4a6a] to-[#192132] border-l-4 border-gray-400 pl-5'
                      : 'hover:bg-gradient-to-r hover:from-[#2f3b57] hover:to-[#192132]'
                    }`}
                >
                  {SubIcon && <SubIcon className="w-4 h-4 mr-2 inline" />}
                  {sub.title}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Single-level item
  return (
    <Link
      key={item.title}
      href={item.href!}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition duration-200
        ${isActiveParent
          ? 'bg-gradient-to-r from-[#3c4a6a] to-[#192132]'
          : 'hover:bg-gradient-to-r hover:from-[#2f3b57] hover:to-[#192132]'
        }`}
    >
      {Icon && <Icon className="w-5 h-5" />} {/* ✅ safe rendering */}
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
