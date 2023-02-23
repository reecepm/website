"use client";

import { IconArrowNarrowLeft, IconArrowUpRight } from "@tabler/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Project } from "../../../data/projects";
import Details from "./Details";
import Media from "./Media";
import { Button } from "../../Button";
import { AnimatePresence, domAnimation, LazyMotion, m } from "framer-motion";
import SearchModal from "../SearchModal";

interface Props {
  project: Project;
}

const Overview: React.FC<Props> = ({ project }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(0);

  return (
    <LazyMotion features={domAnimation}>
      <div className="flex h-full w-full flex-col gap-5 overflow-hidden pt-24 md:h-auto md:items-center md:justify-center md:gap-9 md:pt-0">
        <m.div
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
        </m.div>
        <m.div
          className="grid h-full max-w-7xl grid-cols-5 gap-5 px-8 pb-16 md:h-auto md:gap-9"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Details project={project} />
          <Media {...{ project, setOpen, selectedItem }} />
        </m.div>
        <AnimatePresence>
          {open && (
            <SearchModal
              setOpen={setOpen}
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
              items={project.media.map((x, i) => ({ ...x, id: i }))}
              name={project.name}
              type="Media"
            />
          )}
        </AnimatePresence>
      </div>
    </LazyMotion>
  );
};

export default Overview;
