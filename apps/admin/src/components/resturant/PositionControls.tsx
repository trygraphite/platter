"use client";

import { Button } from "@platter/ui/components/button";
import { ArrowDown, ArrowUp } from "lucide-react";

interface PositionControlsProps {
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export function PositionControls({
  onMoveUp,
  onMoveDown,
  isFirst = false,
  isLast = false,
}: PositionControlsProps) {
  return (
    <div className="flex flex-col gap-1">
      <Button
        variant="outline"
        size="icon"
        className="h-6 w-6"
        onClick={onMoveUp}
        disabled={isFirst}
        title="Move up"
      >
        <ArrowUp className="h-3 w-3" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-6 w-6"
        onClick={onMoveDown}
        disabled={isLast}
        title="Move down"
      >
        <ArrowDown className="h-3 w-3" />
      </Button>
    </div>
  );
}
