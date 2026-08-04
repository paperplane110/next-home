"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import type { EdgeFormDraft, RelationshipType } from "../_types/graph";
import { RELATIONSHIP_TYPE_META } from "../_utils/edge-meta";

const fieldClassName =
  "border-input h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]";

interface EdgeEditorDrawerProps {
  open: boolean;
  value: EdgeFormDraft;
  sourceName: string;
  targetName: string;
  relationshipTypes: RelationshipType[];
  onOpenChange: (open: boolean) => void;
  onChange: (value: EdgeFormDraft) => void;
  onSubmit: () => void;
}

export function EdgeEditorDrawer({
  open,
  value,
  sourceName,
  targetName,
  relationshipTypes,
  onOpenChange,
  onChange,
  onSubmit,
}: EdgeEditorDrawerProps) {
  function updateField<K extends keyof EdgeFormDraft>(key: K, fieldValue: EdgeFormDraft[K]) {
    onChange({
      ...value,
      [key]: fieldValue,
    });
  }

  const selectedRelationshipMeta = RELATIONSHIP_TYPE_META[value.relationshipType];

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="data-[vaul-drawer-direction=right]:w-[min(420px,100vw)] data-[vaul-drawer-direction=right]:sm:max-w-[420px]">
        <DrawerHeader className="border-b border-stone-200/80">
          <DrawerTitle>编辑关系</DrawerTitle>
          <DrawerDescription>
            调整当前 edge 的关系类型、展示标签与补充描述。
          </DrawerDescription>
        </DrawerHeader>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>来源节点</Label>
              <div className="rounded-md border border-stone-200/80 bg-stone-50 px-3 py-2 text-sm text-stone-700">
                {sourceName}
              </div>
            </div>

            <div className="grid gap-2">
              <Label>目标节点</Label>
              <div className="rounded-md border border-stone-200/80 bg-stone-50 px-3 py-2 text-sm text-stone-700">
                {targetName}
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edge-relationship-type">关系类型</Label>
            <select
              id="edge-relationship-type"
              className={fieldClassName}
              value={value.relationshipType}
              onChange={(event) =>
                updateField("relationshipType", event.target.value as EdgeFormDraft["relationshipType"])
              }
            >
              {relationshipTypes.map((relationshipType) => (
                <option key={relationshipType} value={relationshipType}>
                  {RELATIONSHIP_TYPE_META[relationshipType].label || "其他"}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edge-label">展示标签</Label>
            <Input
              id="edge-label"
              value={value.label}
              placeholder={selectedRelationshipMeta.label || "不填写则不显示标签"}
              onChange={(event) => updateField("label", event.target.value)}
            />
            <div className="text-xs text-muted-foreground">
              留空时会回退到当前关系类型的预设标签。
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edge-description">关系描述</Label>
            <textarea
              id="edge-description"
              className="border-input min-h-28 w-full rounded-md border bg-transparent px-3 py-2 text-sm leading-6 shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              placeholder="可补充这条关系的背景、语义或备注。"
              value={value.description}
              onChange={(event) => updateField("description", event.target.value)}
            />
          </div>
        </div>

        <DrawerFooter className="border-t border-stone-200/80 bg-background/80">
          <Button type="button" variant="secondary" onClick={onSubmit}>
            保存关系
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
