import React, { useEffect, useState } from "react";
import { Project } from "../../../data/projects";
import { IconChevronDown, IconChevronUp } from "@tabler/icons";
import { ImageOrVideo } from "./ImageOrVideo";

interface Props {
  project: Project;
  selectedItem: number;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Media: React.FC<Props> = ({ project, selectedItem, setOpen }) => {
  const [viewWidth, setViewWidth] = useState(752);
  const [viewHeight, setViewHeight] = useState(423);
  const [focusOpen, setFocusOpen] = useState(false);

  const frameRef = React.useRef<HTMLDivElement>(null);
  const resizeObserverRef = React.useRef<ResizeObserver>();

  const item = project.media[selectedItem];

  useEffect(() => {
    resizeObserverRef.current = new ResizeObserver(() => {
      if (frameRef.current) {
        if (frameRef.current.offsetWidth < viewWidth) {
          const { width: nextWidth, height: nextHeight } = nearestRatioByWidth(
            frameRef.current.offsetWidth
          );
          setViewWidth(nextWidth);
          setViewHeight(nextHeight);
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

  const nearestRatioByWidth = (
    width: number
  ): { width: number; height: number } => {
    const ratio = 16 / 9;
    const nextWidth = Math.floor(width / ratio) * ratio;
    return {
      width: nextWidth,
      height: nextWidth / ratio,
    };
  };

  return (
    <>
      {focusOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setFocusOpen(false)}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div className="flex h-full w-full flex-col items-center justify-center gap-5">
            <div
              className="relative flex items-center justify-center overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 lg:rounded-3xl"
              style={nearestRatioByWidth(window.innerWidth - 100)}
            >
              <ImageOrVideo item={item.src} autoPlay />
            </div>
          </div>
        </div>
      )}
      <div
        className="col-span-5 flex cursor-pointer flex-col gap-3 md:col-span-3"
        ref={frameRef}
      >
        <div
          className="relative flex items-center justify-center overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 lg:rounded-3xl"
          style={{
            width: viewWidth,
            height: viewHeight,
          }}
          onClick={() => setFocusOpen(true)}
        >
          <ImageOrVideo item={item.src} autoPlay />
        </div>
        <div
          className="flex w-full items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900 px-5 py-3 md:px-8 md:py-4 lg:rounded-3xl lg:px-9 lg:py-5"
          onClick={() => setOpen(true)}
        >
          <div className="flex flex-col gap-1 truncate">
            <div className="truncate text-sm font-semibold text-white sm:text-base md:text-lg lg:text-xl">
              {item.title}
            </div>
            <div className="truncate text-xs text-neutral-300 md:text-sm">
              {item.desc}
            </div>
          </div>
          <div className="flex flex-col text-white">
            <IconChevronUp className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />
            <IconChevronDown className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Media;
