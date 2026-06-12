export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface NavDropdownItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface NavDropdown {
  label: string;
  items: NavDropdownItem[];
}

export type NavItem = NavLink | NavDropdown;

export function isNavDropdown(item: NavItem): item is NavDropdown {
  return 'items' in item;
}

export interface NavigationConfig {
  main: NavItem[];
  ctaButtons: (NavLink & { variant: 'primary' | 'secondary' | 'outline' })[];
}
