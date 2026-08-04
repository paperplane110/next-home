"use client";

import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import type { PersonEditorMode, PersonFormDraft } from "../_types/graph";
import { PersonBadgesInput } from "./person-badges-input";

interface PersonEditorDrawerProps {
  open: boolean;
  mode: PersonEditorMode;
  value: PersonFormDraft;
  onOpenChange: (open: boolean) => void;
  onChange: (value: PersonFormDraft) => void;
  onSubmit: () => void;
}

const categoryOptions = [
  { value: "family", label: "家族" },
  { value: "professional", label: "职场" },
  { value: "media", label: "媒体" },
  { value: "political", label: "政治" },
  { value: "business", label: "商业" },
  { value: "social", label: "社交" },
  { value: "other", label: "其他" },
] as const;

const genderOptions = [
  { value: "unknown", label: "未知" },
  { value: "male", label: "男性" },
  { value: "female", label: "女性" },
] as const;

const fieldClassName =
  "border-input h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]";

export function PersonEditorDrawer({
  open,
  mode,
  value,
  onOpenChange,
  onChange,
  onSubmit,
}: PersonEditorDrawerProps) {
  const isCreateMode = mode === "create";
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      nameInputRef.current?.focus();
      nameInputRef.current?.select();
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [open]);

  function normalizeYearInput(raw: string) {
    return raw.replace(/\D/g, "").slice(0, 4);
  }

  function updateField<K extends keyof PersonFormDraft>(key: K, fieldValue: PersonFormDraft[K]) {
    onChange({
      ...value,
      [key]: fieldValue,
    });
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="data-[vaul-drawer-direction=right]:w-[min(420px,100vw)] data-[vaul-drawer-direction=right]:sm:max-w-[420px]">
        <DrawerHeader className="border-b border-stone-200/80">
          <DrawerTitle>{isCreateMode ? "新增人物" : "编辑人物"}</DrawerTitle>
          <DrawerDescription>
            {isCreateMode
              ? "先在画布中创建默认节点，再补充人物的基础资料。"
              : "更新当前人物的基础资料与视图展示信息。"}
          </DrawerDescription>
        </DrawerHeader>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-5">
          <div className="grid gap-2">
            <Label htmlFor="person-name">姓名</Label>
            <Input
              id="person-name"
              ref={nameInputRef}
              value={value.name}
              placeholder="例如：Katharine Graham"
              onChange={(event) => updateField("name", event.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="person-gender">性别</Label>
              <select
                id="person-gender"
                className={fieldClassName}
                value={value.gender}
                onChange={(event) => updateField("gender", event.target.value as PersonFormDraft["gender"])}
              >
                {genderOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="person-category">分类</Label>
              <select
                id="person-category"
                className={fieldClassName}
                value={value.category}
                onChange={(event) =>
                  updateField("category", event.target.value as PersonFormDraft["category"])
                }
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="person-title">头衔 / 关系描述</Label>
            <Input
              id="person-title"
              value={value.title}
              placeholder="例如：母亲 / 出版人 / 商业伙伴"
              onChange={(event) => updateField("title", event.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="person-birth-date">出生日期</Label>
              <Input
                id="person-birth-date"
                inputMode="numeric"
                value={value.birthDate}
                maxLength={4}
                placeholder="例如：1917"
                onChange={(event) => updateField("birthDate", normalizeYearInput(event.target.value))}
              />
              <p className="text-xs leading-5 text-muted-foreground">一般只需填写年份。</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="person-death-date">死亡日期</Label>
              <Input
                id="person-death-date"
                inputMode="numeric"
                value={value.deathDate}
                maxLength={4}
                placeholder="例如：2001"
                onChange={(event) => updateField("deathDate", normalizeYearInput(event.target.value))}
              />
              <p className="text-xs leading-5 text-muted-foreground">一般只需填写年份。</p>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="person-badges-input">标签</Label>
            <PersonBadgesInput
              inputId="person-badges-input"
              value={value.badges}
              onChange={(badges) => updateField("badges", badges)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="person-summary">人物简介</Label>
            <textarea
              id="person-summary"
              className="border-input min-h-28 w-full rounded-md border bg-transparent px-3 py-2 text-sm leading-6 shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              placeholder="简要记录人物与传记主角之间的关系、身份或备注。"
              value={value.bioSummary}
              onChange={(event) => updateField("bioSummary", event.target.value)}
            />
          </div>
        </div>

        <DrawerFooter className="border-t border-stone-200/80 bg-background/80">
          <Button type="button" variant="secondary" onClick={onSubmit} disabled={!value.name.trim()}>
            {isCreateMode ? "创建人物" : "保存更改"}
            <Kbd className="bg-gray-200">⌘ Enter</Kbd>
          </Button>
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
            取消
            <Kbd>Esc</Kbd>
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
