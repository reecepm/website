import React, { useState } from "react";
import { cva } from "class-variance-authority";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import ContactModal from "./Contact";

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div className="before:[calc(100vh+3.5rem)] h-screen overflow-hidden before:pointer-events-none before:absolute before:inset-0  before:-top-64 before:bg-grid-pattern before:bg-top before:bg-no-repeat before:opacity-70 ">
      <div className="relative z-10 flex h-screen flex-grow flex-col overflow-clip">
        <div className="absolute bottom-[-6.25vw] flex w-screen select-none items-center justify-center bg-gradient-to-r from-neutral-500 to-white bg-clip-text text-[12.5vw] font-extrabold opacity-5 [-webkit-text-stroke:4px_transparent]">
          always learning
        </div>
        <div className="flex h-full w-full flex-grow items-center justify-center">
          <AnimatePresence>
            {contactOpen && <ContactModal setOpen={setContactOpen} />}
          </AnimatePresence>
          {children}
        </div>
        <Nav {...{ setContactOpen }} />
      </div>
    </div>
  );
};

export default Layout;

interface NavProps {
  setContactOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Nav: React.FC<NavProps> = ({ setContactOpen }) => {
  return (
    <motion.div
      className="fixed flex w-full items-center justify-center gap-8 pt-9"
      variants={navVariants}
      transition={{
        duration: 0.5,
        delay: 0.5,
      }}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <NavItem route="/">Home</NavItem>
      <NavItem route="/about">About</NavItem>
      <NavItem route="/work">Work</NavItem>
      <div
        className={navItemStyles({ active: false })}
        onClick={() => setContactOpen(true)}
      >
        Contact
      </div>
    </motion.div>
  );
};

const navVariants = {
  initial: {
    opacity: 0,
    y: -30,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -30,
  },
};

interface NavItemProps {
  children: React.ReactNode;
  route: string;
}

const NavItem: React.FC<NavItemProps> = ({ children, route }) => {
  const router = useRouter();

  return (
    <Link
      href={route}
      className={navItemStyles({
        active:
          route !== "/"
            ? router.pathname.startsWith(route)
            : router.pathname === route,
      })}
    >
      {children}
    </Link>
  );
};

const navItemStyles = cva("text-sm font-medium cursor-pointer transition-all", {
  variants: {
    active: {
      true: "text-white",
      false: "text-neutral-400 hover:text-neutral-300",
    },
  },
});
