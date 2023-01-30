import React from "react";

export interface ButtonProps {
  children: React.ReactNode;
}

export const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & React.ComponentPropsWithoutRef<"button">
>(({ children, disabled, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      className="flex items-center justify-center gap-1.5 text-white px-3 py-1.5 text-sm font-medium bg-neutral-900 border border-neutral-800 rounded-md hover:opacity-70 active:opacity-60 transition-all"
      {...props}
    >
      {children}
    </button>
  );
});
