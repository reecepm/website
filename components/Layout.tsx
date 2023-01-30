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
    <div className="h-screen overflow-hidden before:pointer-events-none before:bg-no-repeat before:bg-grid-pattern before:[calc(100vh+3.5rem)] before:absolute before:inset-0 before:-top-14 before:bg-top before:opacity-70">
      <div className="z-10 relative h-screen flex flex-col flex-grow overflow-clip">
        <div className="absolute flex w-screen items-center justify-center bottom-[-6.25vw] text-[12.5vw] font-extrabold bg-gradient-to-r from-neutral-500 to-white opacity-5 bg-clip-text [-webkit-text-stroke:4px_transparent]">
          always learning
        </div>
        <div className="w-full flex-grow flex items-center justify-center">
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
      className="flex gap-8 items-center w-full justify-center pt-9 fixed"
      variants={navVariants}
      transition={{
        duration: 1.5,
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
