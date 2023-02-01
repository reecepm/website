import Layout from "../components/Layout";
import Tag from "../components/Tag";
import Spotify from "../components/Spotify";
import { AnimatePresence, motion } from "framer-motion";
import { NextPage } from "next";
import { useEffect, useMemo, useState } from "react";
import { ArrayRGB } from "color-thief-react/lib/types";
import tinycolor from "tinycolor2";
import { useLanyardWS, Spotify as SpotifyType } from "use-lanyard";
import { usePalette } from "color-thief-react";

const Home: NextPage = () => {
  const user = useLanyardWS(process.env.NEXT_PUBLIC_DISCORD_ID as `${bigint}`);
  const [brightest, setBrightest] = useState<string | undefined>();
  const [mountDelay, setMountDelay] = useState(false);

  useEffect(() => {
    setTimeout(() => setMountDelay(true), 2500);
  }, []);

  return (
    <motion.div
      className="relative flex flex-col items-center justify-center gap-3"
      variants={parentVaraints}
      transition={{
        duration: 1.5,
        staggerChildren: 0.2,
      }}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div
        className="absolute z-0"
        variants={gradientVariants}
        style={{
          background: `radial-gradient(50% 50% at 50% 50%, rgba(${
            (brightest && `${brightest},1`) || "255, 255, 255, 0.6"
          }) 0%, rgba(0, 0, 0, 0) 100%)`,
        }}
        transition={{
          duration: 3,
          type: "tween",
          ease: [0, 0.25, 0, 1],
        }}
      />
      <motion.div variants={variants}>
        <Tag background={brightest}>Bristol, United Kingdom</Tag>
      </motion.div>
      <motion.div
        variants={variants}
        className="bg-gradient-to-br from-white to-neutral-500 bg-clip-text text-center text-6xl font-bold text-transparent"
      >
        Reece Martin.
      </motion.div>
      <motion.div
        variants={variants}
        className="text-center font-medium text-neutral-400"
      >
        Full stack developer devoted to creating fluid and easy to use software.
      </motion.div>
      {user?.listening_to_spotify &&
        user.spotify &&
        user.spotify?.album_art_url &&
        mountDelay && (
          <motion.div variants={variants}>
            <SpotifyWrapper
              {...{ brightest, setBrightest, data: user.spotify }}
            />
          </motion.div>
        )}
    </motion.div>
  );
};

export default Home;

interface SpotifyWrapperProps {
  brightest: string | undefined;
  setBrightest: React.Dispatch<React.SetStateAction<string | undefined>>;
  data: SpotifyType;
}

const SpotifyWrapper: React.FC<SpotifyWrapperProps> = ({
  brightest,
  setBrightest,
  data,
}) => {
  const {
    data: paletteData,
    loading,
    error,
  } = usePalette(data.album_art_url!, 6, "rgbArray", {
    crossOrigin: "*",
    quality: 100,
  });

  useEffect(() => {
    if (!loading && !error && paletteData && paletteData.length > 0) {
      const mapped = paletteData.map((rgb) =>
        tinycolor(`rgb(${rgb.join(",")})`)
      );
      if (!mapped) return undefined;

      const isFirstBright = mapped[0].getLuminance() > 0.05;
      const color = isFirstBright
        ? mapped[0]
        : mapped.find((color) => color.getLuminance() > 0.05 !== isFirstBright);
      if (!color) return undefined;

      const rgb = color.toRgb();
      setBrightest(`${rgb.r}, ${rgb.g}, ${rgb.b}`);
    }
  }, [paletteData]);

  return <Spotify {...{ brightest, data }} />;
};

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
      duration: 1.0,
    },
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1.0,
    transition: {
      duration: 1.0,
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
