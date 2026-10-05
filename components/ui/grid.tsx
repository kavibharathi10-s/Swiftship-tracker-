// components/ui/grid.tsx
import React from "react";

interface GridProps {
  children: React.ReactNode;
  className?: string;
}

export const Grid: React.FC<GridProps> = ({ children, className }) => {
  return (
    <div className={`grid ${className}`}>
      {children}
    </div>
  );
};