// resources/js/types/shared.ts
import type { SVGProps } from "react";
import { LucideIcon } from "lucide-react";
import type { PageProps as InertiaPageProps } from "@inertiajs/core";

// --------------------
// SharedData (for Inertia)
// --------------------
export interface SharedData extends InertiaPageProps {
  name: string;
  quote: { message: string; author: string };
  auth: {
    user: User | null;
    roles?: string[];
  };
  sidebarOpen: boolean;
}

// --------------------
// Auth & User
// --------------------
export interface Auth {
  user: User;
  roles?: string[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
  email_verified_at: string | null;
  two_factor_enabled?: boolean;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
}

// --------------------
// Navigation
// --------------------
interface BaseNavItem {
  title: string;
  icon?: React.ElementType;
  roles?: string[];
}

export interface LinkNavItem extends BaseNavItem {
  type: "link";
  href: string;
}

export interface GroupNavItem extends BaseNavItem {
  type: "group";
  subItems: LinkNavItem[];
}

export type NavItem = LinkNavItem | GroupNavItem;

export interface BreadcrumbItem {
  title: string;
  href: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface SubItem {
  title: string;
  href: string;
  icon?: LucideIcon | React.FC<React.SVGProps<SVGSVGElement>> | null;
  isActive?: boolean;
  roles?: string[];
}

export type MainNavItem = NavItem;

// --------------------
// Icons
// --------------------
export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

export type LucideIconType = LucideIcon & {
  (props: IconProps): JSX.Element;
};
