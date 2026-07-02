"use client";

import { FolderOpen } from "lucide-react";

import { ToolIconButton } from "./tool-icon-button";

interface LoadGraphButtonProps {
  isDirty: boolean;
  onClick: () => void;
}

export function LoadGraphButton({ isDirty, onClick }: LoadGraphButtonProps) {
  return (
    <ToolIconButton
      label={isDirty ? "从本地加载（将覆盖未保存改动）" : "从本地加载"}
      shortcut="⌘ U"
      onClick={onClick}
    >
      <FolderOpen />
    </ToolIconButton>
  );
}

