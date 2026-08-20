"use client";

import { useEffect, useMemo } from "react";
import {
  CommandIcon,
  DatabaseIcon,
  FrameIcon,
  ImagePlusIcon,
  LogInIcon,
  MessageCircleMoreIcon,
  WavesIcon,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
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
import { useFrame } from "@/components/providers/frame-context";
import { useSetAtom, useAtom } from "jotai";
import { helperCommandOpenAtom, photoUploadDialogOpenAtom } from "@/lib/atoms";
import { allOdysseys } from "content-collections";
import {
  ODYSSEY_CATEGORIES,
  type OdysseyCategory,
} from "@/lib/odyssey";

type OdysseyEntry = (typeof allOdysseys)[number];

export const HelperCommand = () => {
  const [isOpen, setIsOpen] = useAtom(helperCommandOpenAtom);
  const router = useRouter();
  const pathname = usePathname();
  const { toggleFrame } = useFrame();
  const setPhotoUploadDialogOpen = useSetAtom(photoUploadDialogOpenAtom);

  const isOdysseyRoute = pathname?.startsWith("/the-odyssey");

  const odysseyEntriesByCategory = useMemo(() => {
    const grouped = new Map<OdysseyCategory, OdysseyEntry[]>();
    for (const category of ODYSSEY_CATEGORIES) {
      grouped.set(category, []);
    }
    for (const entry of allOdysseys) {
      const category = entry.category as OdysseyCategory;
      if (grouped.has(category)) {
        grouped.get(category)!.push(entry);
      }
    }
    return grouped;
  }, []);

  const goToURL = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  const goToOdysseyEntry = (entry: OdysseyEntry) => {
    setIsOpen(false);
    router.push(`/the-odyssey/${entry._meta.path}`);
  };

  const devOpts = [
    { label: "Sign in", icon: LogInIcon, onSelect: () => goToURL(`/auth/sign-in?redirectTo=${pathname}`) },
    {
      label: "Upload Photo", icon: ImagePlusIcon, onSelect: () => {
        setIsOpen(false);
        // 延迟打开弹窗，避免 dialog 嵌套丢失焦点
        setTimeout(() => {
          setPhotoUploadDialogOpen(true);
        }, 300);
      }
    },
    { label: "Update Today", icon: MessageCircleMoreIcon, onSelect: () => { } },
    {
      label: "Toggle Frame Background",
      icon: FrameIcon,
      onSelect: () => { toggleFrame(); setIsOpen(false); },
    },
  ];

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
  }, [isOpen, setIsOpen]);

  const showOdysseyFirst = isOdysseyRoute;

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

          {showOdysseyFirst && (
            <>
              {Array.from(odysseyEntriesByCategory.entries()).map(([category, entries], idx) =>
                entries.length > 0 ? (
                  <div key={category}>
                    <CommandGroup heading={`Odyssey · ${category}`}>
                      {entries.map((entry) => (
                        <CommandItem
                          key={entry._meta.path}
                          value={`${entry.title}`}
                          onSelect={() => goToOdysseyEntry(entry)}
                          className="flex flex-col items-start gap-1 py-2"
                        >
                          <div className="flex w-full items-center gap-2">
                            <WavesIcon className="size-3.5 shrink-0 text-odyssey-400" />
                            <span className="font-bold">{entry.title}</span>
                          </div>
                          {entry.summary && (
                            <p className="line-clamp-1 w-full text-xs text-muted-foreground pl-[1.4rem]">
                              {entry.summary}
                            </p>
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    {idx < ODYSSEY_CATEGORIES.length - 1 && entries.length > 0 && idx < Array.from(odysseyEntriesByCategory.values()).filter(e => e.length > 0).length - 1 && <CommandSeparator />}
                  </div>
                ) : null
              )}
              <CommandSeparator />
            </>
          )}

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
            <CommandItem
              key="gsc"
              onSelect={() => goToURL("https://search.google.com/search-console/performance/search-analytics?resource_id=sc-domain%3Atyyuan.me")}
              className="font-medium"
            >
              <span className="icon-[logos--google-icon] size-4" />
              <span>Google Search Console (SEO)</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
};
