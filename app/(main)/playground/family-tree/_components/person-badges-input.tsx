"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { Plus, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { sanitizeBadgeList } from "../_utils/person-form";
import { cn } from "@/lib/utils";

interface PersonBadgesInputProps {
  inputId?: string;
  value: string[];
  onChange: (value: string[]) => void;
}

export function PersonBadgesInput({ inputId, value, onChange }: PersonBadgesInputProps) {
  const [pendingBadge, setPendingBadge] = useState("");
  const [editingBadgeIndex, setEditingBadgeIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const hasPendingBadge = pendingBadge.trim().length > 0;

  function resetInputState() {
    setPendingBadge("");
    setEditingBadgeIndex(null);
  }

  function commitBadge() {
    const nextBadge = pendingBadge.trim();

    if (!nextBadge) {
      return false;
    }

    if (editingBadgeIndex === null) {
      onChange(sanitizeBadgeList([...value, nextBadge]));
      setPendingBadge("");
      return true;
    }

    onChange(
      sanitizeBadgeList(
        value.map((badge, index) => (index === editingBadgeIndex ? nextBadge : badge)),
      ),
    );
    resetInputState();
    return true;
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && hasPendingBadge) {
      event.preventDefault();
      event.stopPropagation();
      commitBadge();
      return;
    }

    if (event.key === "Escape" && (hasPendingBadge || editingBadgeIndex !== null)) {
      event.preventDefault();
      event.stopPropagation();
      resetInputState();
      return;
    }

    if (event.key === "Backspace" && !pendingBadge && editingBadgeIndex === null && value.length > 0) {
      event.preventDefault();
      event.stopPropagation();
      onChange(value.slice(0, -1));
    }
  }

  function handleDeleteBadge(indexToDelete: number) {
    onChange(value.filter((_, index) => index !== indexToDelete));

    if (editingBadgeIndex === indexToDelete) {
      resetInputState();
      return;
    }

    if (editingBadgeIndex !== null && editingBadgeIndex > indexToDelete) {
      setEditingBadgeIndex(editingBadgeIndex - 1);
    }
  }

  function handleEditBadge(indexToEdit: number) {
    if (editingBadgeIndex === indexToEdit) {
      resetInputState();
      inputRef.current?.focus();
      return;
    }

    setEditingBadgeIndex(indexToEdit);
    setPendingBadge(value[indexToEdit] ?? "");
    inputRef.current?.focus();
  }

  return (
    <div className="grid gap-3">
      {value.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {value.map((badge, index) => {
            const isEditing = editingBadgeIndex === index;

            return (
              <div
                key={`${badge}-${index}`}
                className="group relative"
              >
                <Button
                  type="button"
                  variant="ghost"
                  className="h-auto rounded-full border border-stone-200 bg-stone-50 p-0 text-[11px] text-foreground hover:bg-stone-100"
                  onClick={() => handleEditBadge(index)}
                >
                  <Badge
                    variant="secondary"
                    className={cn(
                      "pointer-events-none rounded-full text-[11px] shadow-none",
                      isEditing && "bg-black text-white"
                    )}
                  >
                    {badge}
                  </Badge>
                </Button>
                <Button
                  type="button"
                  size="icon-xs"
                  variant="ghost"
                  className="absolute -right-1 -top-1 size-4 rounded-full p-0 bg-red-100 text-red-600 hover:bg-red-200 hover:text-re opacity-0 shadow-xs transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
                  aria-label={`删除标签 ${badge}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleDeleteBadge(index);
                  }}
                >
                  <X className="size-3" />
                </Button>
              </div>
            );
          })}
        </div>
      ) : null}

      <div className="flex items-center gap-2">
        <Input
          id={inputId}
          ref={inputRef}
          value={pendingBadge}
          placeholder={editingBadgeIndex === null ? "输入 badge，按 Enter 添加" : "修改 badge，按 Enter 更新"}
          data-person-badge-input="true"
          data-badge-editing={editingBadgeIndex !== null ? "true" : "false"}
          onChange={(event) => setPendingBadge(event.target.value)}
          onKeyDown={handleInputKeyDown}
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={commitBadge}
          disabled={!hasPendingBadge}
        >
          {editingBadgeIndex === null ? <Plus className="size-4" /> : null}
          {editingBadgeIndex === null ? "添加" : "更新"}
        </Button>
      </div>

      <p className="text-xs leading-5 text-muted-foreground">
        点击 badge 进入或退出编辑；回车添加或更新，右上角圆点按钮可删除。
      </p>
    </div>
  );
}
