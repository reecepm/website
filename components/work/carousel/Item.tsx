import {
  useTransform,
  transform,
  m,
  useMotionValueEvent,
  useMotionValue,
} from "framer-motion";
import { usePageContext } from "./Base";
import { Project } from "../../../data/projects";
import Image from "next/image";
import { IconArrowNarrowRight } from "@tabler/icons";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../Button";
import Link from "next/link";

const alignOptions = { start: 0, center: 0.5, end: 1 };

interface Props {
  index: number;
  project: Project;
  onCurrent: React.Dispatch<React.SetStateAction<number>>;
}

const CarouselItem: React.FC<Props> = ({ project, index, onCurrent }) => {
  const router = useRouter();
  const {
    align,
    frameWidth: frameSize,
    mobileMargin,
    trackSize,
    trackXOffset,
    viewWidth,
    viewHeight,
  } = usePageContext();

  const initialOffset = index * viewWidth;
  const alignOffset = (frameSize - viewWidth) * alignOptions[align];

  const startOffset = useTransform(trackXOffset, (value) => {
    let startOffset = initialOffset + value;

    while (startOffset > trackSize - viewWidth - alignOffset) {
      startOffset -= trackSize;
    }

    while (startOffset < 0 - viewWidth - alignOffset) {
      startOffset += trackSize;
    }

    return startOffset + alignOffset + mobileMargin / 2;
  });

  const normalOffset = useTransform(trackXOffset, (value) => {
    let startOffset = initialOffset + value;

    while (startOffset > trackSize - viewWidth - alignOffset) {
      startOffset -= trackSize;
    }

    while (startOffset < 0 - viewWidth - alignOffset) {
      startOffset += trackSize;
    }

    startOffset += alignOffset;

    const staticOffset = startOffset - alignOffset - trackXOffset.get();
    const getNormalOffset = transform(
      [-staticOffset - viewWidth, -staticOffset, -staticOffset + viewWidth],
      [-1, 0, 1]
    );
    return getNormalOffset(trackXOffset.get());
  });

  const opacity = useTransform(normalOffset, [-1, 0, 1], [0.6, 1, 0.6]);
  const scale = useTransform(normalOffset, [-1, 0, 1], [0.8, 1, 0.8]);

  useMotionValueEvent(scale, "change", (latest) => {
    if (latest > 0.9) {
      onCurrent(index);
    }
  });

  return (
    <m.div
      style={{
        x: startOffset,
        y: 0,
        width: viewWidth,
        height: viewHeight,
        scale,
        opacity,
      }}
      className="absolute flex items-center justify-center overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900"
    >
      <div className="relative flex items-center justify-center">
        <Image
          src={project.coverImagePath}
          placeholder="blur"
          alt={project.name + " cover image"}
          priority
          height={1920}
          width={1080}
          quality={100}
          className="pointer-events-none max-w-none"
        />
        <div className="absolute z-10 h-full w-full bg-gradient-to-t from-black to-black/20">
          <div className="flex h-full flex-col items-center justify-center gap-4">
            <Image
              src={project.logoPath}
              alt={project.name}
              placeholder={project.id !== "malice" ? "blur" : undefined}
              width={48}
              height={48}
              quality={100}
              className="pointer-events-none h-10 w-10 rounded-md sm:h-12 sm:w-12"
            />
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-lg font-bold text-white sm:text-2xl">
                {project.name}
              </h1>
              <p className="text-sm font-medium text-neutral-400 sm:text-lg">
                {project.desc}
              </p>
              <p className="mt-1 text-xs font-medium text-neutral-500">
                {project.completed}
              </p>
            </div>
            <Link href="/work/[id]" as={`/work/${project.id}`}>
              <Button>
                View Project{project.id === "graveyard" && "s"}
                <IconArrowNarrowRight height={16} width={16} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </m.div>
  );
};

export default CarouselItem;
