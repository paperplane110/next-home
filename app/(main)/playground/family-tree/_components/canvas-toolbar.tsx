"use client";

import { Network, Save, WaypointsIcon } from "lucide-react";

import type { GraphViewMode } from "../_types/graph";
import { LoadGraphButton } from "./load-graph-button";
import { ToolIconButton } from "./tool-icon-button";

interface CanvasToolbarProps {
  viewMode: GraphViewMode;
  viewSwitchLabel: string;
  saveLabel: string;
  isDirty: boolean;
  onToggleView: () => void;
  onSave: () => void;
  onLoad: () => void;
}

export function CanvasToolbar({
  viewMode,
  viewSwitchLabel,
  saveLabel,
  isDirty,
  onToggleView,
  onSave,
  onLoad,
}: CanvasToolbarProps) {
  return (
    <div className="pointer-events-auto rounded-[24px] border border-stone-200/80 bg-white/88 p-1 shadow-[0_18px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl">
      <div className="flex items-center gap-1">
        <ToolIconButton label={viewSwitchLabel} active onClick={onToggleView}>
          {viewMode === "family" ? <Network /> : <WaypointsIcon />}
        </ToolIconButton>
        <ToolIconButton label={saveLabel} shortcut="⌘+⇧+S" onClick={onSave}>
          <Save />
        </ToolIconButton>
        <LoadGraphButton isDirty={isDirty} onClick={onLoad} />
      </div>
    </div>
  );
}

