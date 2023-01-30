import Layout from "../components/Layout";
import Tag from "../components/Tag";
import Spotify from "../components/Spotify";
import { motion } from "framer-motion";
import { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <motion.div
      className="flex flex-col gap-3 items-center justify-center relative"
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
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.6) 0%, rgba(0, 0, 0, 0) 100%)",
        }}
        transition={{
          duration: 3,
          type: "tween",
          ease: [0, 0.25, 0, 1],
        }}
      />
      <motion.div variants={variants}>
        <Tag>Bristol, United Kingdom</Tag>
      </motion.div>
      <motion.div
        variants={variants}
        className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-neutral-500 text-center"
      >
        Reece Martin.
      </motion.div>
      <motion.div
        variants={variants}
        className="text-neutral-400 font-medium text-center"
      >
        Full stack developer devoted to creating fluid and easy to use software.
      </motion.div>
      <motion.div variants={variants}>
        <Spotify />
      </motion.div>
    </motion.div>
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
