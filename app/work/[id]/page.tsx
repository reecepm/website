import { Metadata } from "next";
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
    <>
      <Overview project={project!} />
    </>
  );
};

export default Project;

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const project = projects.find((project) => project.id === params.id);

  const title = project?.name || "Project";
  return {
    title,
    description: "A project by Reece Martin. " + project?.desc || "",
    openGraph: {
      images: [
        {
          url: project?.coverImagePath || "",
          width: 1920,
          height: 1080,
          alt: project?.desc,
        },
      ],
    },
  };
}

export const generateStaticParams = async () => {
  return projects.map((project) => ({
    id: project.id,
  }));
};
