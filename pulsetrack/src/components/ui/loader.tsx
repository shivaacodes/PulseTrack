import React from "react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const Loader = ({ className, size = "md" }: LoaderProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div
        className={cn(
          "animate-[spin_0.8s_linear_infinite] rounded-full border-2 border-primary/20 border-t-primary",
          sizeClasses[size],
          className
        )}
      />
    </div>
  );
};

export default Loader; 