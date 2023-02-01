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
    <div className="col-span-2 flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Image
          src={project.logoPath}
          width={96}
          height={96}
          quality={100}
          alt={project.name}
        />
        <div className="flex flex-col items-start gap-1">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-white">{project.name}</h1>
            <p className="text-xl font-medium text-neutral-400">
              {project.desc}
            </p>
          </div>
          <Tag>{getStatusText(project.status)}</Tag>
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <h1 className="text-2xl font-bold text-white">Overview</h1>
        <p className="text-base font-medium text-neutral-400">
          {project.overview}
        </p>
      </div>
      <div className="flex flex-col gap-5">
        <h1 className="text-2xl font-bold text-white">Responsibilities</h1>
        <p className="text-base font-medium text-neutral-400">
          {project.responsibilities}
        </p>
      </div>
      <div className="flex flex-col gap-5">
        <h1 className="text-2xl font-bold text-white">Technologies</h1>
        <div className="grid grid-cols-3 gap-y-1 text-neutral-400">
          {project.technologies.map((x) => (
            <Technology key={x} id={x} />
          ))}
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
