"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  IconArrowNarrowRight,
  IconBook,
  IconBriefcase,
  IconCpu,
  IconUser,
} from "@tabler/icons";
import { technologies } from "../../data/technologies";
import { AnimatePresence, domAnimation, LazyMotion, m } from "framer-motion";
import Technology from "../../components/Technology";
import { Button } from "../../components/Button";
import ContactModal from "../../components/Contact";
import Item from "./Item";

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
          <div className="m-4 grid grid-cols-1 gap-4 sm:m-0 sm:grid-cols-2 sm:p-4 md:gap-8">
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
