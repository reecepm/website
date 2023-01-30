import { IconArrowNarrowLeft, IconArrowNarrowRight } from "@tabler/icons";
import { MotionValue, useMotionValue, animate, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { projects } from "../../../data/projects";
import CarouselItem from "./Item";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { getIconById } from "../../icons";

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
    if (frameRef.current) setFrameWidth(frameRef.current.offsetWidth);
  }, []);

  useEffect(() => {
    resizeObserverRef.current = new ResizeObserver(() => {
      if (frameRef.current) {
        setFrameWidth(frameRef.current.offsetWidth);
        if (frameRef.current.offsetWidth < viewWidth) {
          // find next lowest 16:9 ratio from width
          const ratio = 16 / 9;
          const nextWidth =
            Math.floor(frameRef.current.offsetWidth / ratio) * ratio;
          setViewWidth(nextWidth);
          setViewHeight(nextWidth / ratio);

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
  return (
    <div className="w-full flex flex-col gap-9 overflow-hidden">
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
        className="w-full flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div
          className="flex items-center justify-between py-2"
          style={{ width: viewWidth }}
        >
          <div className="flex items-center gap-8">
            {projects.map((item, index) => {
              const Icon = getIconById(item.id);
              return (
                <button
                  key={index}
                  className="flex gap-1 items-center text-sm cursor-pointer transition-all group"
                  onClick={() => {
                    if (index !== currentItem) {
                      // if its from start to end or end to start, only move by 1
                      // if its any other case, move by the difference
                      const isEndToStart =
                        index === 0 && currentItem === projects.length - 1;
                      const isStartToEnd =
                        index === projects.length - 1 && currentItem === 0;
                      moveTrackPosition(
                        ((index < currentItem && !isEndToStart) || isStartToEnd
                          ? viewWidth
                          : -viewWidth) *
                          (isEndToStart || isStartToEnd
                            ? 1
                            : Math.abs(index - currentItem))
                      );
                    }
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
              className="w-8 h-8 flex items-center justify-center bg-neutral-900 border border-neutral-800 rounded-full text-white cursor-pointer shadow-md hover:scale-110 transition-all"
            >
              <IconArrowNarrowLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => moveTrackPosition(-viewWidth)}
              className="w-8 h-8 flex items-center justify-center bg-neutral-900 border border-neutral-800 rounded-full text-white cursor-pointer shadow-md hover:scale-110 transition-all"
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
