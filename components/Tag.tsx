import { ArrayRGB } from "color-thief-react/lib/types";
import React from "react";

interface Props {
  children?: React.ReactNode;
  background?: string;
}

const Tag: React.FC<Props> = ({ children, background }) => {
  return (
    <div
      className="bg-amber-900/40 border-amber-700/20 text-amber-600 border font-medium text-xs py-1.5 px-3 rounded-full flex items-center justify-center text-center"
      style={{
        borderColor: `rgba(${background || "120, 53, 15"}, 0.2)`,
        color: `rgb(${background || "180 83 9"})`,
        backgroundColor: `rgba(${background || "120, 53, 15"}, 0.2)`,
        filter: "saturate(1.5)",
      }}
    >
      {children}
    </div>
  );
};

export default Tag;
