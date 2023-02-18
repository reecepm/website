import { useMotionValue } from "framer-motion";

export const useMouseMove = () => {
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

  return { mouseX, mouseY, onMouseMove };
};
