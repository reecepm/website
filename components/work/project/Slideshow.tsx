import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Project } from "../../../data/projects";
import { twMerge } from "tailwind-merge";
import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  MotionValue,
  transform,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import useOutsideClick from "../../../hooks/outsideCick";
import useMeasure from "react-use-measure";
import { ImageOrVideo } from "./ImageOrVideo";
import SearchModal from "./SearchModal";

interface Props {
  project: Project;
  selectedItem: number;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Slideshow: React.FC<Props> = ({ project, selectedItem, setOpen }) => {
  const [viewWidth, setViewWidth] = useState(752);
  const [viewHeight, setViewHeight] = useState(423);

  const frameRef = React.useRef<HTMLDivElement>(null);
  const resizeObserverRef = React.useRef<ResizeObserver>();

  const item = project.media[selectedItem];

  useEffect(() => {
    resizeObserverRef.current = new ResizeObserver(() => {
      if (frameRef.current) {
        // setFrameWidth(frameRef.current.offsetWidth);
        if (frameRef.current.offsetWidth < viewWidth) {
          // find next lowest 16:9 ratio from width
          const ratio = 16 / 9;
          const nextWidth =
            Math.floor(frameRef.current.offsetWidth / ratio) * ratio;
          setViewWidth(nextWidth);
          setViewHeight(nextWidth / ratio);
        } else {
          setViewWidth(752);
          setViewHeight(423);
        }
      }
    });
    resizeObserverRef.current.observe(frameRef.current!);
    return () => {
      resizeObserverRef.current?.disconnect();
    };
  }, []);

  return (
    <>
      <div
        className="col-span-3 flex cursor-pointer flex-col gap-3"
        ref={frameRef}
      >
        <div
          className="relative flex items-center justify-center overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900"
          style={{
            width: viewWidth,
            height: viewHeight,
          }}
        >
          <ImageOrVideo item={item.src} autoPlay />
        </div>
        <div
          className="flex w-full items-center justify-between rounded-3xl border border-neutral-800 bg-neutral-900 px-9 py-5"
          onClick={() => setOpen(true)}
        >
          <div className="flex flex-col gap-1">
            <div className="text-xl font-semibold text-white">{item.title}</div>
            <div className="text-sm text-neutral-300">{item.desc}</div>
          </div>
          <div className="flex flex-col text-white">
            <IconChevronUp />
            <IconChevronDown />
          </div>
        </div>
      </div>
    </>
  );
};

export default Slideshow;
