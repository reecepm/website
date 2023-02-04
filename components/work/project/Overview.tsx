import { IconArrowNarrowLeft, IconArrowUpRight } from "@tabler/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Project } from "../../../data/projects";
import Details from "./Details";
import Media from "./Media";
import { Button } from "../../Button";
import { AnimatePresence, motion } from "framer-motion";
import SearchModal from "../SearchModal";

interface Props {
  project: Project;
}

const Overview: React.FC<Props> = ({ project }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(0);

  return (
    <div className="flex h-full w-full flex-col gap-5 overflow-hidden pt-24 md:h-auto md:gap-9 md:pt-0">
      <motion.div
        className="flex w-full max-w-7xl items-center justify-between px-8"
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
        <div className="group flex">
          <Link
            href={project.url}
            className="flex items-center gap-1 text-xs font-medium text-neutral-200 transition-all group-hover:text-white sm:text-sm"
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
        className="grid h-full max-w-7xl grid-cols-5 gap-5 overflow-y-scroll px-8 pb-16 md:h-auto md:gap-9"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Details project={project} />
        <Media {...{ project, setOpen, selectedItem }} />
      </motion.div>
      <AnimatePresence>
        {open && (
          <SearchModal
            setOpen={setOpen}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            items={project.media}
            name={project.name}
            type="Media"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Overview;
