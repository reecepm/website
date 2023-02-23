"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cva } from "class-variance-authority";

interface NavItemProps {
  children: React.ReactNode;
  route: string;
}

const NavItem: React.FC<NavItemProps> = ({ children, route }) => {
  const pathname = usePathname();

  return (
    <Link
      href={route}
      prefetch={false}
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

export const navItemStyles = cva(
  "text-sm font-medium cursor-pointer transition-all pointer-events-auto",
  {
    variants: {
      active: {
        true: "text-white",
        false: "text-neutral-400 hover:text-neutral-300",
      },
    },
  }
);
