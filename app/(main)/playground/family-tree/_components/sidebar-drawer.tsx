"use client";

import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { BiographyPersonData } from "../_types/graph";

const categoryLabel: Record<BiographyPersonData["category"], string> = {
  family: "家族",
  professional: "职业",
  media: "媒体",
  political: "政治",
  business: "商业",
  social: "社交",
  other: "其他",
};

interface SidebarDrawerProps {
  person: BiographyPersonData | null;
  onClose: () => void;
}

export function SidebarDrawer({ person, onClose }: SidebarDrawerProps) {
  return (
    <aside
      className={cn(
        "rounded-[24px] border border-stone-200/80 bg-white/88 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.28em] text-stone-400">人物详情</div>
          <h2 className="mt-1.5 text-lg font-semibold text-stone-900">
            {person?.name ?? "选择人物"}
          </h2>
          {person?.title ? (
            <p className="mt-1.5 text-sm leading-5 text-stone-600">{person.title}</p>
          ) : person ? (
            <p className="mt-1.5 text-sm leading-5 text-stone-500">
              点击画布中的人物节点，这里会展示人物摘要、标签与角色类型。
            </p>
          ) : null}
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          disabled={!person}
          className="pointer-events-auto rounded-full"
        >
          <X />
        </Button>
      </div>

      {person ? (
        <>
          <div className="mt-4 flex flex-wrap gap-1.5">
            <Badge variant="outline" className="rounded-full text-[10px]">
              {categoryLabel[person.category]}
            </Badge>
            {person.birthDeath ? (
              <Badge variant="secondary" className="rounded-full text-[10px]">
                {person.birthDeath}
              </Badge>
            ) : null}
            {person.badges?.map((badge) => (
              <Badge key={badge} variant="secondary" className="rounded-full text-[10px]">
                {badge}
              </Badge>
            ))}
          </div>

          <div className="mt-4 space-y-3 text-sm leading-6 text-stone-600">
            <p>{person.bioSummary}</p>
          </div>
        </>
      ) : null}
    </aside>
  );
}
