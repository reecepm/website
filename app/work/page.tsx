"use client";
import { domAnimation, LazyMotion } from "framer-motion";
import React from "react";
import CarouselBase from "../../components/work/carousel/Base";

const Work: React.FC = () => {
  return (
    <LazyMotion features={domAnimation}>
      <CarouselBase />
    </LazyMotion>
  );
};

export default Work;
