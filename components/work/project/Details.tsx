import React from "react";
import Image from "next/image";
import { Project } from "../../../data/projects";
import Link from "next/link";
import { IconArrowUpRight } from "@tabler/icons";
import Tag from "../../Tag";
import Technology from "../../Technology";

interface Props {
  project: Project;
}

const Details: React.FC<Props> = ({ project }) => {
  return (
    <div className="col-span-5 flex flex-col  gap-5 md:col-span-2 lg:gap-8">
      <div className="flex items-center gap-4">
        <Image
          src={project.logoPath}
          width={96}
          height={96}
          quality={100}
          alt={project.name}
          className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 lg:h-24 lg:w-24"
        />
        <div className="flex w-full items-start justify-between gap-1 md:w-auto md:flex-col md:justify-start">
          <div className="flex flex-col">
            <h1 className="text-sm font-bold text-white sm:text-base md:text-lg lg:text-2xl">
              {project.name}
            </h1>
            <p className="text-xs font-medium text-neutral-400 sm:text-sm md:text-base lg:text-xl">
              {project.desc}
            </p>
          </div>
          <Tag>{getStatusText(project.status)}</Tag>
        </div>
      </div>
      <div className="flex flex-col gap-3 md:gap-5 lg:gap-8">
        <div className="flex flex-col gap-1.5 md:gap-3 lg:gap-5">
          <h1 className="text-base font-bold text-white md:text-lg lg:text-2xl">
            Overview
          </h1>
          <p className="text-xs font-medium text-neutral-400 lg:text-base">
            {project.overview}
          </p>
        </div>
        <div className="flex flex-col gap-1.5 md:gap-3 lg:gap-5">
          <h1 className="text-base font-bold text-white md:text-lg lg:text-2xl">
            Responsibilities
          </h1>
          <p className="text-xs font-medium text-neutral-400 lg:text-base">
            {project.responsibilities}
          </p>
        </div>
        <div className="flex flex-col gap-1.5 md:gap-3 lg:gap-5">
          <h1 className="text-base font-bold text-white md:text-lg lg:text-2xl">
            Technologies
          </h1>
          <div className="grid grid-cols-3 gap-y-1 text-xs font-medium text-neutral-400 lg:text-base">
            {project.technologies.map((x) => (
              <Technology key={x} id={x} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;

const getStatusText = (status: Project["status"]) => {
  switch (status) {
    case "PRODUCTION":
      return "In Production";
    case "IN_PROGRESS":
      return "In Development";
    case "EOL":
      return "End Of Life";
    case "ARCHIVED":
      return "Archived";
  }
};
