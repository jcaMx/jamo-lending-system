import { LucideIcon } from "lucide-react";

export interface Auth {
  user: User;
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
  href?: string; // ✅ always a string for menus
  icon?: LucideIcon | React.FC<React.SVGProps<SVGSVGElement>> | null;
  isActive?: boolean;
  subItems?: SubItem[];
}

export interface SubItem {
  title: string;
  href: string; // ✅ always a string
  icon?: LucideIcon | React.FC<React.SVGProps<SVGSVGElement>> | null;
  isActive?: boolean;
}

// MainNavItem is just a NavItem
export type MainNavItem = NavItem;

export interface SharedData {
  name: string;
  quote: { message: string; author: string };
  auth: Auth;
  sidebarOpen: boolean;
  [key: string]: unknown;
}

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
