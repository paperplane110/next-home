"use client"

import { useState, useEffect } from "react";
import { CommandIcon, FrameIcon, GitBranchIcon, ImagePlusIcon, LogInIcon, MessageCircleMoreIcon } from "lucide-react";
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

  const onSelect = (href: string) => {
    setIsOpen(false);
    router.push(href);
  }

  const devOpts = [
    { label: "Sign in", icon: LogInIcon, onSelect: () => onSelect("/auth/sign-in") },
    {
      label: "Upload Photo", icon: ImagePlusIcon, onSelect: () => {
        setIsOpen(false)
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
                onSelect={() => onSelect(item.href)}
                className="font-medium"
              >
                <item.icon className="size-4 text-primary" />
                <span>{item.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Repository">
            <CommandItem
              key="repo"
              onSelect={() => onSelect("https://github.com/paperplane110/next-home")}
              className="font-medium"
            >
              <GitBranchIcon className="size-4 text-primary" />
              <span>Github Repository: next-home</span>
            </CommandItem>
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
        </CommandList>
      </CommandDialog>
    </div>
  )
}