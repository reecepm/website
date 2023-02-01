import { IconUser, TablerIcon } from "@tabler/icons";
import { cva } from "class-variance-authority";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import Link from "next/link";
import React, { useRef, useState, useId } from "react";

type Props = typeof containerStyles extends (props: infer T) => any
  ? T & {
      children?: React.ReactNode;
      highlights?: "white" | "red" | "blue" | "green" | "purple";
      spotlightSize?: "md" | "lg";
    }
  : never;

export const SpotlightContainer: React.FC<Props> = ({
  children,
  highlights,
  spotlightSize,
  ...props
}) => {
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
  let maskImage = useMotionTemplate`radial-gradient(${
    spotlightSize === "lg" ? "250px" : "180px"
  } at ${mouseX}px ${mouseY}px, white, transparent)`;
  let style = { maskImage, WebkitMaskImage: maskImage };

  return (
    <div
      onMouseMove={onMouseMove}
      className={containerStyles({ highlights, ...props })}
    >
      <motion.div
        className={spotlightStyles({
          highlights,
        })}
        style={style}
      />
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 transition-all group-hover:ring-white/20" />
      <div className="relative flex gap-3 truncate">{children}</div>
    </div>
  );
};

export default SpotlightContainer;

const spotlightStyles = cva(
  "absolute inset-0 rounded-2xl opacity-0 transition duration-300",
  {
    variants: {
      highlights: {
        white: "bg-neutral-700/50 group-hover:opacity-100",
        red: "bg-gradient-to-tr from-rose-500/30 to-pink-700/30 group-hover:opacity-30",
        blue: "bg-gradient-to-tr from-blue-500/30 to-indigo-700/30 group-hover:opacity-30",
        green:
          "bg-gradient-to-tr from-green-500/30 to-emerald-700/30 group-hover:opacity-30",
        purple:
          "bg-gradient-to-tr from-purple-500/30 to-violet-700/30 group-hover:opacity-30",
      },
    },
    defaultVariants: {
      highlights: "white",
    },
  }
);

export const containerStyles = cva(
  "group relative flex rounded-2xl hover:shadow-md hover:shadow-black/5 bg-neutral-900 hover:scale-[1.02] transition-all",
  {
    variants: {
      padding: {
        lg: "p-12",
        md: "p-6",
      },
      fixedWidth: {
        sm: "w-80",
        md: "w-[500px]",
      },
      fixedHeight: {
        md: "h-[300px]",
      },
      gap: {
        sm: "gap-2.5",
      },
      highlights: {
        white: "selection:bg-neutral-400/50",
        red: "selection:bg-rose-500/50",
        blue: "selection:bg-blue-500/50",
        green: "selection:bg-green-500/50",
        purple: "selection:bg-purple-500/50",
      },
    },
    defaultVariants: {
      padding: "md",
    },
  }
);
