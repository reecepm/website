import {
  useTransform,
  transform,
  m,
  useMotionValueEvent,
  useMotionValue,
} from "framer-motion";
import { usePageContext } from "./Base";
import { projects } from "../../../data/projects";
import Image from "next/image";
import { IconArrowNarrowRight } from "@tabler/icons";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../Button";

const alignOptions = { start: 0, center: 0.5, end: 1 };

interface Props {
  index: number;
  onCurrent: React.Dispatch<React.SetStateAction<number>>;
}

const CarouselItem: React.FC<Props> = ({ index, onCurrent }) => {
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

  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  const onMouseMove = ({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

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
      onMouseMove={onMouseMove}
      className="absolute flex items-center justify-center overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900"
    >
      <div className="relative flex items-center justify-center">
        <Image
          src={projects[index].coverImagePath}
          alt={projects[index].name + " cover image"}
          height={1920}
          width={1080}
          quality={100}
          className="pointer-events-none max-w-none"
        />
        <div className="absolute z-10 h-full w-full bg-gradient-to-t from-black to-black/20">
          <div className="flex h-full flex-col items-center justify-center gap-4">
            <Image
              src={projects[index].logoPath}
              alt={projects[index].name}
              width={48}
              height={48}
              quality={100}
              className="pointer-events-none h-10 w-10 rounded-md sm:h-12 sm:w-12"
            />
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-lg font-bold text-white sm:text-2xl">
                {projects[index].name}
              </h1>
              <p className="text-sm font-medium text-neutral-400 sm:text-lg">
                {projects[index].desc}
              </p>
            </div>
            <Button onClick={() => router.push("/work/" + projects[index].id)}>
              View Project{projects[index].id === "graveyard" && "s"}
              <IconArrowNarrowRight height={16} width={16} />
            </Button>
          </div>
        </div>
      </div>
    </m.div>
  );
};

export default CarouselItem;
