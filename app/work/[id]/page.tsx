"use client";

import { domAnimation, LazyMotion } from "framer-motion";
import React from "react";
import Overview from "../../../components/work/project/Overview";
import { projects } from "../../../data/projects";

interface Props {
  params: { id: string };
}

const Project: React.FC<Props> = ({ params }) => {
  const { id } = params;

  const project = projects.find((project) => project.id === id);

  return (
    <LazyMotion features={domAnimation}>
      <Overview project={project!} />
    </LazyMotion>
  );
};

export default Project;

export const generateStaticParams = async () => {
  return projects.map((project) => ({
    id: project.id,
  }));
};
