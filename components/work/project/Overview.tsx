import { IconArrowNarrowLeft, IconArrowUpRight } from "@tabler/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Project } from "../../../data/projects";
import Details from "./Details";
import Slideshow from "./Slideshow";
import { Button } from "../../Button";
import { AnimatePresence, motion } from "framer-motion";
import SearchModal from "./SearchModal";

interface Props {
  project: Project;
}

const Overview: React.FC<Props> = ({ project }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(0);

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
            className="flex items-center gap-1 text-base font-medium text-neutral-200 transition-all group-hover:text-white"
          >
            Visit Website
            <IconArrowUpRight
              height={18}
              width={18}
              className="text-neutral-300 transition-all group-hover:text-white"
            />
          </Link>
        </div>
      </motion.div>
      <motion.div
        className="grid max-w-7xl grid-cols-5 gap-9"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Details project={project} />
        <Slideshow {...{ project, setOpen, selectedItem }} />
      </motion.div>
      <AnimatePresence>
        {open && (
          <SearchModal
            setOpen={setOpen}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            project={project}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Overview;
