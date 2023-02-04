import React from "react";

interface Props {
  children?: React.ReactNode;
  background?: string;
}

const Tag: React.FC<Props> = ({ children, background }) => {
  return (
    <div
      className="flex items-center justify-center rounded-full border border-amber-700/20 bg-amber-900/40 py-1 px-2.5 text-center text-xs text-amber-600 transition-all md:py-1.5 md:px-3 md:font-medium"
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
