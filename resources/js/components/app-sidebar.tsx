import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type MainNavItem, type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, User } from 'lucide-react';
import AppLogo from './app-logo';
import AppLogoIcon from './app-logo-icon';
import { BorrowersIcon } from '@/components/icons/BorrowersIcon';
import { UserIcon } from '@/components/icons/UserIcon';
import { LoansIcon } from '@/components/icons/LoansIcon';
import { RepaymentsIcon } from '@/components/icons/RepaymentsIcon';
import { DailyCollectionsIcon } from '@/components/icons/DailyCollectionsIcon';
import { ReportsIcon } from '@/components/icons/ReportsIcon';



const mainNavItems: MainNavItem[] = [
    {
        title: 'Dashboard',
        icon: LayoutGrid,
        subItems: [
            {
                title: 'Overview',
                href: dashboard(),
            },
        ],
    },
    {
        title: 'Borrowers',
        icon: BorrowersIcon,
        subItems: [
            {
                title: 'View All Borrowers',
                href: '/borrowers',
            },
        ],
    },
    {
        title: 'Loans',
        icon: LoansIcon,
        subItems: [
            {
                title: 'View All Loans',
                href: '/loans',
            },
            {
                title: 'Past Maturity Date',
                href: '/loans/past-maturity-date',
            },
            {
                title: '1 Month Late Loans',
                href: '/loans/1-month-late',
            },
            { 
                title: '3 Month Late Loans',
                href: '/loans/3-month-late',
            },
            {
                title: 'Add Loan',
                href: '/loans/1-month-late',
            },
            { 
                title: 'View Loan Applications',
                href: '/loans/view-loan-applications',
            },
            
        ],

    },
    {
        title: 'Repayments',
        icon: RepaymentsIcon,
        subItems: [
            {
                title: 'View Repayments',
                href: '/repayments',
            },
        ],
    },
    {
        title: 'Daily Collections',
        icon: DailyCollectionsIcon,
        subItems: [
            {
                title: 'Daily Collection Sheet',
                href: '/daily-collections',
            },
        ],
    },
        {
        title: 'Reports',
        icon: ReportsIcon,
        subItems: [
            {
                title: 'Daily Cash Position Report', href: '/Reports/DCPR'
            },
            {
                title: 'Monthly Report',
                href: '/Reports/MonthlyReport',
            },
            {
                title: 'Income Statement Report',
                href: '/Reports/IncomeStatementReport',
            },
        ],
    },
    {
        title: 'System Users',
        icon: UserIcon,
        subItems: [
            {
                title: 'View Users',
                href: '/system-users',
            },
            {
                title: 'Add User',
                href: '/system-users/add',
            },
        ],
    },

    
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    }
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset" className="bg-[#192132] text-white" >
            <SidebarHeader className="bg-[#192132] text-white">
                <SidebarMenu className="bg-[#192132] text-white" >
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent shadow-none hover:shadow-none"
                        >
                            <Link href={dashboard()} prefetch className="no-underline hover:no-underline focus:no-underline">
                                <AppLogoIcon />
                                {/* <img src="/images/jamo-logo-1.jpg" alt="JAMO Lending Logo" className="h-10 rounded" /> */}
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="bg-[#192132] text-white">
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="bg-[#192132] text-white">
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
