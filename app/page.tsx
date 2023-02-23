"use client";

import { useEffect, useState } from "react";
import Tag from "../components/Tag";
import { Spotify } from "../components/Spotify";
import { domAnimation, LazyMotion, m } from "framer-motion";
import { useLanyardWS } from "use-lanyard";

const Home: React.FC = () => {
  const user = useLanyardWS(process.env.NEXT_PUBLIC_DISCORD_ID as `${bigint}`);
  const [brightest, setBrightest] = useState<string | undefined>();
  const [mountDelay, setMountDelay] = useState(false);

  useEffect(() => {
    setTimeout(() => setMountDelay(true), 2500);
  }, []);

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        className="relative flex flex-col items-center justify-center gap-3"
        variants={parentVaraints}
        transition={{
          staggerChildren: 0.2,
        }}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <m.div
          className="absolute z-0"
          variants={gradientVariants}
          style={{
            background: `radial-gradient(50% 50% at 50% 50%, rgba(${
              (brightest && `${brightest},1`) || "255, 255, 255, 0.6"
            }) 0%, rgba(0, 0, 0, 0) 100%)`,
          }}
          transition={{
            duration: 0.5,
            type: "tween",
            ease: [0, 0.25, 0, 1],
          }}
        />
        <m.div variants={variants}>
          <a
            href="https://www.google.com/maps/place/Bristol,+United+Kingdom"
            target="_blank"
            referrerPolicy="no-referrer"
          >
            <Tag background={brightest}>Bristol, United Kingdom</Tag>
          </a>
        </m.div>
        <m.div
          variants={variants}
          className="bg-gradient-to-br from-white to-neutral-500 bg-clip-text text-center text-5xl font-bold text-transparent sm:text-6xl"
        >
          Reece Martin.
        </m.div>
        <m.div
          variants={variants}
          className="px-8 text-center text-sm font-medium text-neutral-400 sm:px-0 sm:text-base"
        >
          Full stack developer devoted to creating fluid and easy to use
          software.
        </m.div>
        {user?.listening_to_spotify &&
          user.spotify &&
          user.spotify?.album_art_url &&
          mountDelay && (
            <m.div variants={variants} className="mt-4">
              <Spotify {...{ brightest, setBrightest, data: user.spotify }} />
            </m.div>
          )}
      </m.div>
    </LazyMotion>
  );
};

export default Home;

const parentVaraints = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
    transition: {
      delay: 0.3,
      staggerChildren: 0.2,
      staggerDirection: -1,
    },
  },
};

const gradientVariants = {
  initial: {
    width: 0,
    height: 0,
    opacity: 0,
  },
  animate: {
    width: 1000,
    height: 1000,
    opacity: 0.3,
  },
  exit: {
    width: 0,
    height: 0,
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
};

const variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 1.4,
    transition: {
      duration: 0.5,
    },
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1.0,
    transition: {
      duration: 0.5,
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 1.4,
    transition: {
      duration: 0.3,
    },
  },
};
