import { IconArrowNarrowLeft, IconArrowUpRight } from "@tabler/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Project } from "../../../data/projects";
import Details from "./Details";
import Slideshow from "./Slideshow";
import { Button } from "../../Button";
import { motion } from "framer-motion";

interface Props {
  project: Project;
}

const Overview: React.FC<Props> = ({ project }) => {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-9">
      <motion.div
        className="flex w-full items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: {
            delay: 0.2,
            duration: 0.4,
          },
        }}
        exit={{ opacity: 0 }}
      >
        <Button onClick={() => router.push("/work")}>
          <IconArrowNarrowLeft height={16} width={16} />
          Browse
        </Button>
        <div className="group">
          <Link
            href={project.url}
            className="text-neutral-200 font-medium text-base flex gap-1 items-center group-hover:text-white transition-all"
          >
            Visit Website
            <IconArrowUpRight
              height={18}
              width={18}
              className="text-neutral-300 group-hover:text-white transition-all"
            />
          </Link>
        </div>
      </motion.div>
      <motion.div
        className="grid grid-cols-5 gap-9 max-w-7xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Details project={project} />
        <Slideshow project={project} />
      </motion.div>
    </div>
  );
};

export default Overview;
