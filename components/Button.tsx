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
      className="flex items-center justify-center gap-1.5 rounded-md border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white transition-all hover:opacity-70 active:opacity-60"
      {...props}
    >
      {children}
    </button>
  );
});
