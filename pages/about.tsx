import { GetStaticProps, NextPage } from "next";
import React from "react";
import Layout from "../components/Layout";
import Image from "next/image";
import SpotlightContainer from "../components/SpotlightContainer";
import { cva } from "class-variance-authority";
import {
  IconBook,
  IconBriefcase,
  IconCpu,
  IconUser,
  TablerIcon,
} from "@tabler/icons";
import { technologies } from "../data/technologies";
import { motion } from "framer-motion";
import Technology from "../components/Technology";

interface Props {
  technologies: (keyof typeof technologies)[];
}

const About: NextPage<Props> = ({ technologies }) => {
  return (
    <motion.div className="flex flex-col gap-8">
      <motion.div
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
          <div className="text-2xl font-bold text-white">Hey, I'm Reece.</div>
          <div className="text-xl font-medium text-neutral-400">
            Full stack developer
          </div>
        </div>
      </motion.div>
      <div className="grid grid-cols-2 gap-8">
        <Item title="About me" Icon={IconUser} highlights="red">
          I love to build/break things and learning almost anything. <br />
          <br />
          Strive to build polished end-to-end web, mobile and desktop
          applications.
          <br />
          <br />I also love working out, football, F1, sneakers and travel.
        </Item>
        <Item title="Always learning" Icon={IconBook} highlights="blue">
          “Once you stop learning, you start dying”.
          <br />
          <br />
          I did not attend university, however, I strongly believe that everyone
          should always be learning, in all roads of life.
          <br />
          <br />I always love to learn new technologies and also to learn about
          random topics.
        </Item>
        <Item title="Current work" Icon={IconBriefcase} highlights="green">
          Working as an independent contractor for web, mobile and desktop
          projects. Also building some cool side projects (coming soon).
          <br />
          <br /> Feel free to reach out if you are interested in working with
          me.
        </Item>
        <Item title="Technologies" Icon={IconCpu} highlights="purple">
          <div className="flex flex-col gap-1">
            <div className="grid grid-cols-3 gap-y-1">
              {technologies.map((x) => (
                <Technology key={x} id={x} />
              ))}
            </div>
            <div className="mt-0.5 flex w-full justify-end text-xs text-neutral-500">
              ...and plenty of other technologies!
            </div>
          </div>
        </Item>
      </div>
    </motion.div>
  );
};

export default About;

export const getStaticProps: GetStaticProps = async () => {
  const tech = Object.keys(technologies);
  return { props: { technologies: tech } };
};

interface ItemProps {
  title: string;
  Icon: TablerIcon;
  children?: React.ReactNode;
  highlights?: React.ComponentProps<typeof SpotlightContainer>["highlights"];
}

const Item: React.FC<ItemProps> = ({ title, Icon, highlights, children }) => {
  return (
    <motion.div
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
      <SpotlightContainer
        fixedWidth="md"
        fixedHeight="md"
        padding="lg"
        spotlightSize="lg"
        highlights={highlights}
      >
        <div className="flex flex-col gap-1 truncate">
          <div className="flex items-center gap-3">
            <div className={iconWrapperStyles({ highlights })}>
              <Icon className={iconStyles({ highlights })} size={16} />
            </div>
            <div className="font-bold text-white">{title}</div>
          </div>
          <div className="flex whitespace-normal pt-3 text-sm text-neutral-400">
            {children}
          </div>
        </div>
      </SpotlightContainer>
    </motion.div>
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
