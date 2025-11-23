// resources/js/types/inertia.d.ts
import type { PageProps } from '@inertiajs/core';

declare module '@inertiajs/core' {
  interface PageProps {
    name: string;
    quote: { message: string; author: string };
    auth: {
      user: {
        id: number;
        name: string;
        email: string;
        avatar?: string;
        email_verified_at: string | null;
        two_factor_enabled?: boolean;
        created_at: string;
        updated_at: string;
      } | null;
      roles?: string[];
    };
    sidebarOpen: boolean;
  }
}

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



// Supporting types for navigation and UI
import { LucideIcon } from "lucide-react";

export interface Auth {
  user: User;
  roles?: string[];
}

export interface BreadcrumbItem {
  title: string;
  href: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface NavItem {
  title: string;
  href?: string;                  // optional for groups
  icon?: React.ElementType;
  subItems?: NavItem[];           // recursive
  roles?: string[];
}

export interface SubItem {
  title: string;
  href: string;
  icon?: LucideIcon | React.FC<React.SVGProps<SVGSVGElement>> | null;
  isActive?: boolean;
  roles?: string[];
}

export type MainNavItem = NavItem;

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  email_verified_at: string | null;
  two_factor_enabled?: boolean;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
}
