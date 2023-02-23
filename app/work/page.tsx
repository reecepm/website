"use client";
import { domMax, LazyMotion } from "framer-motion";
import React from "react";
import CarouselBase from "../../components/work/carousel/Base";

const Work: React.FC = () => {
  return (
    <LazyMotion features={domMax}>
      <CarouselBase />
    </LazyMotion>
  );
};

export default Work;
