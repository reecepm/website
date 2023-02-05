"use client";

import { cva } from "class-variance-authority";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { twJoin } from "tailwind-merge";
import ContactModal from "../Contact";
import NavItem from "./item";

const Nav: React.FC = () => {
  const [contactOpen, setContactOpen] = useState(false);
  const [background, setBackground] = useState(false);
  const [scrollVal, setScrollVal] = useState(0);

  const checkScrollTop = () => {
    setScrollVal(window.scrollY);
    if (!background && window.scrollY > 0) {
      setBackground(true);
    } else if (window.scrollY <= 0) {
      setBackground(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", checkScrollTop);
    return () => {
      window.removeEventListener("scroll", checkScrollTop);
    };
  }, []);

  return (
    <>
      <motion.div
        className={twJoin(
          "fixed flex w-full items-center justify-center gap-8 border-0 border-b border-b-white/0 py-9 transition-colors",
          background && "border-b-white/10 bg-white/1 backdrop-blur-md"
        )}
        variants={navVariants}
        transition={{
          duration: 0.3,
          delay: 0,
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
      <AnimatePresence>
        {contactOpen && <ContactModal setOpen={setContactOpen} />}
      </AnimatePresence>
    </>
  );
};

export default Nav;

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

export const navItemStyles = cva(
  "text-sm font-medium cursor-pointer transition-all",
  {
    variants: {
      active: {
        true: "text-white",
        false: "text-neutral-400 hover:text-neutral-300",
      },
    },
  }
);
