import { useState } from "react";
import { cn } from "@/lib/utils";
import { CELL_SIZE } from "@/lib/constants";

interface SquareProps {
  x: number;
  y: number;
  isValidMove: boolean;
  isKnightSquare: boolean;
  onSelect: () => void;
}

export function Square({
  x,
  y,
  isValidMove,
  isKnightSquare,
  onSelect,
}: SquareProps) {
  const [isHovered, setIsHovered] = useState(false);

  const isCheckerLight = (x + y) % 2 !== 0;

  const hoverColor = isKnightSquare
    ? "bg-red-400 dark:bg-red-700"
    : isValidMove
      ? "bg-green-400 dark:bg-green-600"
      : "bg-red-400 dark:bg-red-700";

  return (
    <button
      type="button"
      aria-label={`column ${x}, row ${y}`}
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      className={cn(
        "absolute top-0 left-0 box-border border border-black transition-all duration-150 ease-out focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none dark:border-white/5",
        isValidMove ? "cursor-pointer" : "cursor-not-allowed",
        isHovered
          ? cn(
              hoverColor,
              "border-transparent shadow-[inset_0_4px_10px_rgba(0,0,0,0.55)] brightness-90",
            )
          : isCheckerLight
            ? "bg-white"
            : "bg-black",
      )}
      style={{
        width: CELL_SIZE,
        height: CELL_SIZE,
        transform: `translate(${x * CELL_SIZE}px, ${y * CELL_SIZE}px)`,
      }}
    />
  );
}
