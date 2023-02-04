import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconSearch,
} from "@tabler/icons";
import {
  MotionValue,
  useMotionValue,
  animate,
  motion,
  AnimatePresence,
} from "framer-motion";
import React, { useEffect, useState } from "react";
import { projects } from "../../../data/projects";
import CarouselItem from "./Item";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { getIconById } from "../../icons";
import SearchModal from "../SearchModal";
import { Button } from "../../Button";

const snap = (width: number) => (value: number) => {
  const snapTo = Math.round(value / width) * width;
  return snapTo;
};

type AlignUnion = "start" | "center" | "end";

type PageViewContextProps = {
  align: AlignUnion;
  frameWidth: number;
  trackSize: number;
  viewWidth: number;
  viewHeight: number;
  trackXOffset: MotionValue;
  mobileMargin: number;
};

const PageContext = React.createContext<PageViewContextProps | undefined>(
  undefined
);

export const usePageContext = () => {
  const contextValue = React.useContext(PageContext);
  if (!contextValue) {
    throw new Error("Missing context");
  }
  return contextValue;
};

const CarouselBase = () => {
  const MOBILE_MARGIN = 32;
  const [viewWidth, setViewWidth] = useState(912);
  const [viewHeight, setViewHeight] = useState(513);

  const [currentItem, setCurrentItem] = useState(0);

  const frameRef = React.useRef<HTMLDivElement>(null);
  const resizeObserverRef = React.useRef<ResizeObserver>();
  const [frameWidth, setFrameWidth] = React.useState(-1);
  const trackSize = projects.length * viewWidth;
  const trackXOffset = useMotionValue(0);

  const snapTo = snap(viewWidth);
  const moveTrackPosition = (amount: number) => {
    const nextXOffset = trackXOffset.get() + amount;
    animate(trackXOffset, snapTo(nextXOffset), {
      type: "spring",
      damping: 80,
      stiffness: 400,
    });
  };

  useEffect(() => {
    if (frameRef.current)
      setFrameWidth(frameRef.current.offsetWidth - MOBILE_MARGIN);
  }, []);

  useEffect(() => {
    resizeObserverRef.current = new ResizeObserver(() => {
      if (frameRef.current) {
        setFrameWidth(frameRef.current.offsetWidth - MOBILE_MARGIN);
        if (frameRef.current.offsetWidth - MOBILE_MARGIN < viewWidth) {
          // find next lowest 16:9 ratio from width
          const ratio = 16 / 9;
          const nextWidth =
            Math.floor((frameRef.current.offsetWidth - MOBILE_MARGIN) / ratio) *
            ratio;
          setViewWidth(nextWidth);
          setViewHeight(nextWidth / ratio);

          if (nextWidth < 400) {
            setViewWidth(nextWidth);
            setViewHeight(nextWidth * 1.4);
          } else {
            setViewWidth(nextWidth);
            setViewHeight(nextWidth / ratio);
          }

          // setViewWidth(frameRef.current.offsetWidth);
          // trackXOffset.set(0);
        } else {
          setViewWidth(912);
          setViewHeight(513);
        }
      }
    });
    resizeObserverRef.current.observe(frameRef.current!);
    return () => {
      resizeObserverRef.current?.disconnect();
    };
  }, []);

  const moveToIndex = (index: number) => {
    if (index !== currentItem) {
      // if its from start to end or end to start, only move by 1
      // if its any other case, move by the difference
      const isEndToStart = index === 0 && currentItem === projects.length - 1;
      const isStartToEnd = index === projects.length - 1 && currentItem === 0;
      moveTrackPosition(
        ((index < currentItem && !isEndToStart) || isStartToEnd
          ? viewWidth
          : -viewWidth) *
          (isEndToStart || isStartToEnd ? 1 : Math.abs(index - currentItem))
      );
    }
  };

  const [mobileNavigation, setMobileNavigation] = useState(false);

  return (
    <div className="flex w-full flex-col gap-4 overflow-hidden">
      <div className="w-full md:hidden">
        <AnimatePresence>
          {mobileNavigation && (
            <SearchModal
              setOpen={setMobileNavigation}
              selectedItem={currentItem}
              setSelectedItem={moveToIndex}
              items={projects.map((x, i) => ({
                id: i,
                type: "Project",
                title: x.name,
                desc: x.desc,
                src: x.coverImagePath,
              }))}
              name="My Work"
              type="Media"
            />
          )}
        </AnimatePresence>
      </div>
      <motion.div
        ref={frameRef}
        className="flex overflow-hidden"
        style={{
          height: viewHeight + 40,
          padding: "20px 0",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          drag="x"
          _dragX={trackXOffset}
          dragTransition={{
            power: 1,
            bounceStiffness: 100,
            modifyTarget: (value) => snapTo(value),
          }}
          style={{
            position: "relative",
            width: frameWidth,
          }}
        >
          <PageContext.Provider
            value={{
              align: "center",
              frameWidth,
              trackSize,
              viewHeight,
              viewWidth,
              mobileMargin: MOBILE_MARGIN,
              trackXOffset: trackXOffset,
            }}
          >
            {projects.map((item, index) => (
              <CarouselItem
                key={index}
                index={index}
                onCurrent={setCurrentItem}
              />
            ))}
          </PageContext.Provider>
        </motion.div>
      </motion.div>
      <motion.div
        className="flex w-full items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div
          className="flex items-center justify-between py-2"
          style={{ width: viewWidth }}
        >
          <div className="flex md:hidden">
            <div
              className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-xl border border-neutral-800 bg-neutral-900 px-5 py-3 text-sm text-white"
              onClick={() => setMobileNavigation(true)}
            >
              Browse projects
              <IconSearch className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            {projects.map((item, index) => {
              const Icon = getIconById(item.id);
              return (
                <button
                  key={index}
                  className="group flex cursor-pointer items-center gap-1 text-sm transition-all"
                  onClick={() => {
                    moveToIndex(index);
                  }}
                >
                  <Icon
                    className={twMerge(
                      "transition-all group-hover:fill-white",
                      index === currentItem ? "fill-white" : "fill-neutral-400"
                    )}
                  />
                  <div
                    className={twMerge(
                      "transition-all group-hover:text-white",
                      index === currentItem ? "text-white" : "text-neutral-400"
                    )}
                  >
                    {item.name}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => moveTrackPosition(viewWidth)}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-white shadow-md transition-all hover:scale-110"
            >
              <IconArrowNarrowLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => moveTrackPosition(-viewWidth)}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-white shadow-md transition-all hover:scale-110"
            >
              <IconArrowNarrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CarouselBase;
