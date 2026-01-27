"use client"

import { useState, useEffect } from "react";
import { CommandIcon, DatabaseIcon, FrameIcon, ImagePlusIcon, LogInIcon, MessageCircleMoreIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "./ui/badge";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { pageList } from "@/lib/page-list";
import { useFrame } from "./frame-context";
import { useSetAtom } from "jotai";
import { photoUploadDialogOpenAtom } from "@/lib/modal-store";

export const HelperCommand = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { toggleFrame } = useFrame();
  const setPhotoUploadDialogOpen = useSetAtom(photoUploadDialogOpenAtom);

  const goToURL = (href: string) => {
    setIsOpen(false);
    router.push(href);
  }

  const devOpts = [
    { label: "Sign in", icon: LogInIcon, onSelect: () => goToURL("/auth/sign-in") },
    {
      label: "Upload Photo", icon: ImagePlusIcon, onSelect: () => {
        setIsOpen(false)
        // 延迟打开弹窗，避免 dialog 嵌套丢失焦点
        setTimeout(() => {
          setPhotoUploadDialogOpen(true)
        }, 300)
      }
    },
    { label: "Update Today", icon: MessageCircleMoreIcon, onSelect: () => { } },
    {
      label: "Toggle Frame Background",
      icon: FrameIcon,
      onSelect: () => { toggleFrame(); setIsOpen(false) },
    },
  ]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div>
      <Badge
        variant="secondary"
        className="text-muted-foreground border-none py-1 select-none cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CommandIcon className="size-4 -mr-0.5" />K
      </Badge>
      <CommandDialog title="helper-command" open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="navigation">
            {pageList.map((item) => (
              <CommandItem
                key={item.href}
                onSelect={() => goToURL(item.href)}
                className="font-medium"
              >
                <item.icon className="size-4 text-primary" />
                <span>{item.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Dev Opt">
            {devOpts.map((item) => (
              <CommandItem
                key={item.label}
                onSelect={item.onSelect}
                className="font-medium"
              >
                <item.icon className="size-4 text-primary" />
                <span>{item.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />

          {/* 仓库、部署、数据库相关链接 */}
          <CommandGroup heading="Repo & Deployment & Database">
            <CommandItem
              key="repo"
              onSelect={() => goToURL("https://github.com/paperplane110/next-home")}
              className="font-medium"
            >
              <span className="icon-[logos--github-icon] size-4" />
              <span>Github Repository: next-home</span>
            </CommandItem>
            <CommandItem
              key="deploy"
              onSelect={() => goToURL("https://vercel.com/paperplane110s-projects/next-home")}
              className="font-medium"
            >
              <span className="icon-[logos--vercel-icon] size-4" />
              <span>Vercel</span>
            </CommandItem>
            <CommandItem
              key="blob"
              onSelect={() => goToURL("https://vercel.com/paperplane110s-projects/next-home/stores/blob/store_neuL1shzdDwVm3wD/browser")}
              className="font-medium"
            >
              <DatabaseIcon className="size-4 text-orange-400" />
              <span>Vercel Blob Storage</span>
            </CommandItem>
            <CommandItem
              key="db"
              onSelect={() => goToURL("https://console.neon.tech/app/projects/bold-hill-91359463?branchId=br-restless-term-ahc8j6t2")}
              className="font-medium"
            >
              <span className="icon-[logos--neon-icon] size-4" />
              <span>Neon DB</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  )
}