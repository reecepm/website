import { IconArrowNarrowLeft, IconArrowUpRight } from "@tabler/icons";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { Button } from "../../../components/Button";
import Details from "../../../components/work/project/Details";
import Media from "../../../components/work/project/Media";
import { projects } from "../../../data/projects";

interface Props {
  params: { id: string };
}

const Project: React.FC<Props> = ({ params }) => {
  const { id } = params;

  const project = projects.find((project) => project.id === id);

  if (!project) return null;

  return (
    <div className="flex min-h-screen w-full flex-col gap-5 pt-24 animate-in fade-in duration-1000 md:h-auto md:items-center md:justify-center md:gap-9 md:pt-0">
      <div className="flex w-full max-w-7xl items-center justify-between px-8">
        <Link href="/work">
          <Button>
            <IconArrowNarrowLeft height={16} width={16} />
            Browse
          </Button>
        </Link>
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
      </div>
      <div className="grid max-w-7xl grid-cols-5 gap-5 px-8 pb-16 md:h-auto md:gap-9">
        <Details project={project} />
        <Media {...{ project }} />
      </div>
    </div>
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
          url: project?.coverImagePath.src || "",
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
