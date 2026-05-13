import { SidebarTrigger } from "@/components/ui/sidebar";
import { Link, usePage } from "@inertiajs/react";
import AppLogoIcon from "@/components/app-logo-icon";
import { type SharedData } from '@/types';
import { UserInfo } from '@/components/user-info';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { ChevronsUpDown } from 'lucide-react';

export function TopBar() {
    const { auth } = usePage<SharedData>().props;

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-white px-4 lg:hidden shadow-sm">
            <div className="flex items-center gap-4">
                <SidebarTrigger className="h-9 w-9 text-gray-600" />
                <Link href="/customer/dashboard">

                </Link>
            </div>

            {auth.user && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 rounded-full border p-1 hover:bg-gray-50 transition">
                            <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold text-xs overflow-hidden">
                                {auth.user.name.charAt(0)}
                            </div>
                            <ChevronsUpDown className="h-4 w-4 text-gray-400" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-white" align="end">
                        <UserMenuContent user={auth.user} />
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </header>
    );
}
