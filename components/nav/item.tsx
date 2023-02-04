"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { navItemStyles } from ".";
import Link from "next/link";

interface NavItemProps {
  children: React.ReactNode;
  route: string;
}

const NavItem: React.FC<NavItemProps> = ({ children, route }) => {
  const pathname = usePathname();

  return (
    <Link
      href={route}
      className={navItemStyles({
        active:
          route !== "/" ? pathname?.startsWith(route) : pathname === route,
      })}
    >
      {children}
    </Link>
  );
};

export default NavItem;
