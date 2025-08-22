// src/components/ui.tsx
"use client";
import React from "react";
import clsx from "clsx";

export const Card: React.FC<
  React.PropsWithChildren<{ className?: string }>
> = ({ className, children }) => (
  <div
    className={clsx(
      "rounded-2xl border p-4 shadow-sm bg-white text-black",
      className
    )}
  >
    {children}
  </div>
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "outline";
};

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "outline",
  ...props
}) => (
  <button
    {...props}
    className={clsx(
      "px-3 py-2 rounded-xl border hover:opacity-90 disabled:opacity-50",
      variant === "solid"
        ? "bg-black text-white"
        : "bg-white text-black",
      className
    )}
  >
    {children}
  </button>
);
