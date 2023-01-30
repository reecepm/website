import React from "react";

interface Props {
  children?: React.ReactNode;
}

const Tag: React.FC<Props> = ({ children }) => {
  return (
    <div className="bg-amber-900/40 border border-amber-400/20 text-amber-600 font-medium text-xs py-1.5 px-3 rounded-full flex items-center justify-center text-center">
      {children}
    </div>
  );
};

export default Tag;
