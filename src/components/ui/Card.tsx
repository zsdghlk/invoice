import React from "react";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`bg-white shadow rounded-md p-4 ${className}`}>
      {children}
    </div>
  );
}
