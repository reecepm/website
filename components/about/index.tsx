"use client";
import React, { useState } from "react";
import Image from "next/image";
import SpotlightContainer from "../../components/SpotlightContainer";
import { cva } from "class-variance-authority";
import {
  IconArrowNarrowRight,
  IconBook,
  IconBriefcase,
  IconCpu,
  IconMinus,
  IconPlus,
  IconUser,
  TablerIcon,
} from "@tabler/icons";
import { technologies } from "../../data/technologies";
import { AnimatePresence, domAnimation, LazyMotion, m } from "framer-motion";
import Technology from "../../components/Technology";
import { Button } from "../../components/Button";
import { twMerge } from "tailwind-merge";
import ContactModal from "../../components/Contact";

const AboutPage: React.FC = () => {
  const [openItem, setOpenItem] = useState(-1);
  const [contactOpen, setContactOpen] = useState(false);

  const handleOpen = (value: number) => {
    setOpenItem(openItem === value ? -1 : value);
  };

  return (
    <>
      <LazyMotion features={domAnimation}>
        <AnimatePresence>
          {contactOpen && <ContactModal setOpen={setContactOpen} />}
        </AnimatePresence>
        <m.div className="flex w-full flex-col gap-4 sm:w-auto sm:gap-8">
          <m.div
            className="flex items-center justify-center gap-4"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
          >
            <Image
              src="/reece.jpeg"
              width={72}
              height={72}
              alt="Reece Martin"
              className="rounded-xl"
              quality={100}
            />
            <div className="flex flex-col gap-1">
              <div className="text-lg font-bold text-white md:text-xl lg:text-2xl">
                Hey, I'm Reece.
              </div>
              <div className="text-base font-medium text-neutral-400 md:text-lg lg:text-xl">
                Full stack developer
              </div>
            </div>
          </m.div>
          <div className="m-4 grid grid-cols-1 gap-4 sm:m-0 sm:grid-cols-2 md:gap-8">
            <Item
              title="About me"
              Icon={IconUser}
              highlights="red"
              open={openItem === 0}
              onClick={() => handleOpen(0)}
            >
              I love to build/break things and learning almost anything. <br />
              <br />
              Strive to build polished end-to-end web, mobile and desktop
              applications.
              <br />
              <br />I also love working out, football, F1, sneakers and travel.
            </Item>
            <Item
              title="Always learning"
              Icon={IconBook}
              highlights="blue"
              open={openItem === 1}
              onClick={() => handleOpen(1)}
            >
              “Once you stop learning, you start dying”.
              <br />
              <br />
              I did not attend university, however, I strongly believe that
              everyone should always be learning, in all roads of life.
              <br />
              <br />I always love to learn (especially new technologies) and to
              try new things.
            </Item>
            <Item
              title="Current work"
              Icon={IconBriefcase}
              highlights="green"
              open={openItem === 2}
              onClick={() => handleOpen(2)}
            >
              <div className="flex flex-col gap-2">
                Currently working as an independent contractor for web, mobile
                and desktop projects. Also building some cool side projects
                (coming soon).
                <br />
                <br /> Feel free to reach out if you are interested in working
                with me, I'm always open to new opportunities!
                <div className="self-end">
                  <Button onClick={() => setContactOpen(true)}>
                    Hire me <IconArrowNarrowRight height={18} width={18} />
                  </Button>
                </div>
              </div>
            </Item>
            <Item
              title="Technologies"
              Icon={IconCpu}
              highlights="purple"
              open={openItem === 3}
              onClick={() => handleOpen(3)}
            >
              <div className="flex w-full flex-col gap-1">
                <div className="grid grid-cols-3 gap-y-1">
                  {(Object.keys(technologies) as (keyof typeof technologies)[])
                    .slice(0, 18)
                    .map((x) => (
                      <Technology key={x} id={x} />
                    ))}
                </div>
                <div className="mt-0.5 flex w-full justify-end text-xs text-neutral-500">
                  ...and plenty of other technologies!
                </div>
              </div>
            </Item>
          </div>
        </m.div>
      </LazyMotion>
    </>
  );
};

export default AboutPage;

interface ItemProps {
  title: string;
  Icon: TablerIcon;
  children?: React.ReactNode;
  highlights?: React.ComponentProps<typeof SpotlightContainer>["highlights"];
  open?: boolean;
  onClick: () => void;
}

const Item: React.FC<ItemProps> = ({
  title,
  Icon,
  highlights,
  children,
  open,
  onClick,
}) => {
  return (
    <m.div
      onClick={onClick}
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      className="w-full cursor-pointer sm:flex sm:cursor-default"
    >
      <SpotlightContainer
        fixedWidth="md"
        fixedHeight="md"
        padding="lg"
        spotlightSize="lg"
        highlights={highlights}
      >
        <div className="flex w-full flex-col gap-1 truncate">
          <div className="flex items-center justify-between">
            <div className="flex w-full items-center gap-3">
              <div className={iconWrapperStyles({ highlights })}>
                <Icon className={iconStyles({ highlights })} size={16} />
              </div>
              <div className="text-sm font-bold text-white lg:text-base">
                {title}
              </div>
            </div>
            <div className="flex text-white sm:hidden">
              {open ? (
                <IconMinus height={18} width={18} />
              ) : (
                <IconPlus height={18} width={18} />
              )}
            </div>
          </div>
          <div
            className={twMerge(
              "w-full whitespace-normal pt-3 text-xs text-neutral-400  lg:text-sm",
              open ? "flex" : "hidden sm:flex"
            )}
          >
            {children}
          </div>
        </div>
      </SpotlightContainer>
    </m.div>
  );
};

const iconWrapperStyles = cva(
  "flex items-center justify-center p-1 bg-neutral-500/20 border border-neutral-300/50 rounded-full transition-all",
  {
    variants: {
      highlights: {
        white: "group-hover:border-white/50 group-hover:bg-white/20",
        red: "group-hover:border-rose-500/50 group-hover:bg-rose-400/20",
        blue: "group-hover:border-blue-500/50 group-hover:bg-blue-400/20",
        green: "group-hover:border-green-500/50 group-hover:bg-green-400/20",
        purple: "group-hover:border-purple-500/50 group-hover:bg-purple-400/20",
      },
    },
  }
);

const iconStyles = cva("text-white transition-all", {
  variants: {
    highlights: {
      white: "text-white",
      red: "group-hover:text-rose-500",
      blue: "group-hover:text-blue-500",
      green: "group-hover:text-green-500",
      purple: "group-hover:text-purple-500",
    },
  },
});
