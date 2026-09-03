"use client";

import { useEffect, useMemo } from "react";
import {
  CommandIcon,
  DatabaseIcon,
  FrameIcon,
  ImagePlusIcon,
  LanguagesIcon,
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
  getAllEntries,
  getEntrySlug,
  getOdysseyEntryDisplayTitle,
  getOdysseyEntrySearchFields,
  getOdysseyEntrySummary,
  type OdysseyCategory,
} from "@/lib/odyssey";
import {
  getOdysseyCategoryLabel,
  getOdysseyCopy,
  getOdysseyEntryHref,
  getOdysseyHomeHref,
  getOdysseyHrefForLocaleFromPathname,
  getOdysseyLocale,
  isOdysseyPathname,
} from "@/lib/odyssey-i18n";
import { getAlternateLocale } from "@/lib/i18n";

type OdysseyEntry = (typeof allOdysseys)[number];

const HELPER_COMMAND_COPY = {
  zh: {
    placeholder: "搜索页面、词条与工具...",
    empty: "未找到结果。",
    navigation: "导航",
    dev: "开发工具",
    infra: "仓库、部署与数据库",
    odysseyGroup: "Odyssey",
  },
  en: {
    placeholder: "Search pages, entries, and tools...",
    empty: "No results found.",
    navigation: "Navigation",
    dev: "Dev Tools",
    infra: "Repo, Deploy & Database",
    odysseyGroup: "Odyssey",
  },
} as const;

function normalizeCommandText(value: string | null | undefined) {
  return (value ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// \u7b80\u5355\u5b50\u4e32\u5339\u914d\uff1a\u628a\u6240\u6709\u53ef\u641c\u7d22\u5b57\u6bb5\u62fc\u6210\u4e00\u4e2a\u5b57\u7b26\u4e32\uff0c\u5305\u542b\u5168\u90e8 token \u5373\u547d\u4e2d\uff0c\u4e0d\u505a\u6743\u91cd\u6392\u5e8f
function commandFilterMatches(
  parts: Array<string | null | undefined>,
  tokens: string[],
) {
  const haystack = normalizeCommandText(parts.join(" "));
  return tokens.every((token) => haystack.includes(token));
}

export const HelperCommand = () => {
  const [isOpen, setIsOpen] = useAtom(helperCommandOpenAtom);
  const router = useRouter();
  const pathname = usePathname();
  const { toggleFrame } = useFrame();
  const setPhotoUploadDialogOpen = useSetAtom(photoUploadDialogOpenAtom);

  const odysseyLocale = getOdysseyLocale(pathname);
  const isOdysseyRoute = isOdysseyPathname(pathname);
  const alternateOdysseyLocale = getAlternateLocale(odysseyLocale);
  const commandCopy = HELPER_COMMAND_COPY[odysseyLocale];
  const odysseyCopy = getOdysseyCopy(odysseyLocale);

  const odysseyEntriesByCategory = useMemo(() => {
    const grouped = new Map<OdysseyCategory, OdysseyEntry[]>();
    for (const category of ODYSSEY_CATEGORIES) {
      grouped.set(category, []);
    }
    for (const entry of getAllEntries(odysseyLocale)) {
      const category = entry.category as OdysseyCategory;
      if (grouped.has(category)) {
        grouped.get(category)!.push(entry);
      }
    }
    return grouped;
  }, [odysseyLocale]);

  const odysseySearchIndex = useMemo(() => {
    return new Map(
      getAllEntries(odysseyLocale).map((entry) => {
        const searchFields = getOdysseyEntrySearchFields(entry, odysseyLocale);

        return [
          getEntrySlug(entry),
          {
            displayTitle: getOdysseyEntryDisplayTitle(entry, odysseyLocale),
            summary: getOdysseyEntrySummary(entry, odysseyLocale),
            localizedCategoryLabel: getOdysseyCategoryLabel(entry.category, odysseyLocale),
            alternateCategoryLabel: getOdysseyCategoryLabel(entry.category, alternateOdysseyLocale),
            localized: searchFields.localized,
            alternate: searchFields.alternate,
          },
        ] as const;
      })
    );
  }, [alternateOdysseyLocale, odysseyLocale]);

  const navigationItems = useMemo(() => {
    return pageList.map((item) => {
      if (item.href !== getOdysseyHomeHref()) {
        return item;
      }

      return {
        ...item,
        href: getOdysseyHomeHref(odysseyLocale),
        label: odysseyCopy.wikiButton,
      };
    });
  }, [odysseyCopy.wikiButton, odysseyLocale]);

  const commandFilter = useMemo(() => {
    return (value: string, search: string, keywords?: string[]) => {
      const query = normalizeCommandText(search);
      if (!query) return 1;

      const tokens = query.split(" ").filter(Boolean);
      const odysseyEntry = odysseySearchIndex.get(value);

      if (odysseyEntry) {
        // 只搜标题 + 别名（含另一语言的标题与别名），避免摘要/标签/分类带来噪音
        return commandFilterMatches(
          [
            odysseyEntry.localized.title,
            ...odysseyEntry.localized.aliases,
            odysseyEntry.alternate.title,
            ...odysseyEntry.alternate.aliases,
          ],
          tokens,
        ) ? 1 : 0;
      }

      return commandFilterMatches([value, ...(keywords ?? [])], tokens) ? 1 : 0;
    };
  }, [odysseySearchIndex]);

  const goToURL = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  const goToOdysseyEntry = (entry: OdysseyEntry) => {
    setIsOpen(false);
    router.push(getOdysseyEntryHref(odysseyLocale, entry));
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
      <CommandDialog
        title="helper-command"
        open={isOpen}
        onOpenChange={setIsOpen}
        commandProps={{ filter: commandFilter }}
      >
        <CommandInput placeholder={commandCopy.placeholder} />
        <CommandList>
          <CommandEmpty>{commandCopy.empty}</CommandEmpty>

          {showOdysseyFirst && (
            <>
              {Array.from(odysseyEntriesByCategory.entries()).map(([category, entries], idx) =>
                entries.length > 0 ? (
                  <div key={category}>
                    <CommandGroup heading={`${commandCopy.odysseyGroup} · ${getOdysseyCategoryLabel(category, odysseyLocale)}`}>
                      {entries.map((entry) => (
                        <CommandItem
                          key={getEntrySlug(entry)}
                          value={getEntrySlug(entry)}
                          onSelect={() => goToOdysseyEntry(entry)}
                          className="flex flex-col items-start gap-1 py-2"
                        >
                          <div className="flex w-full items-center gap-2">
                            <WavesIcon className="size-3.5 shrink-0 text-odyssey-400" />
                            <span className="font-bold">{getOdysseyEntryDisplayTitle(entry, odysseyLocale)}</span>
                          </div>
                          {getOdysseyEntrySummary(entry, odysseyLocale) && (
                            <p className="line-clamp-1 w-full text-xs text-muted-foreground pl-[1.4rem]">
                              {getOdysseyEntrySummary(entry, odysseyLocale)}
                            </p>
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    {idx < ODYSSEY_CATEGORIES.length - 1 && entries.length > 0 && idx < Array.from(odysseyEntriesByCategory.values()).filter(e => e.length > 0).length - 1 && <CommandSeparator />}
                  </div>
                ) : null
              )}
              <CommandGroup heading={`${commandCopy.odysseyGroup} · ${odysseyCopy.languageLabel}`}>
                <CommandItem
                  key="odyssey-language-toggle"
                  value="Switch Language 切换语言 语言 Language English 中文 Chinese zh en"
                  keywords={["language", "lang", "switch", "translate", "切换", "语言", "翻译", "中文", "英文", "english", "chinese", "zh", "en"]}
                  onSelect={() => goToURL(getOdysseyHrefForLocaleFromPathname(pathname, alternateOdysseyLocale))}
                  className="font-medium"
                >
                  <LanguagesIcon className="size-4 text-odyssey-400" />
                  <span>
                    {odysseyLocale === "zh"
                      ? "切换到 English（英文）"
                      : "Switch to 中文（Chinese）"}
                  </span>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
            </>
          )}

          <CommandGroup heading={commandCopy.navigation}>
            {navigationItems.map((item) => (
              <CommandItem
                key={item.href}
                value={item.label}
                keywords={[item.href]}
                onSelect={() => goToURL(item.href)}
                className="font-medium"
              >
                <item.icon className="size-4 text-primary" />
                <span>{item.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading={commandCopy.dev}>
            {devOpts.map((item) => (
              <CommandItem
                key={item.label}
                value={item.label}
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
          <CommandGroup heading={commandCopy.infra}>
            <CommandItem
              key="repo"
              value="Github Repository next-home"
              keywords={["repo", "github", "next-home"]}
              onSelect={() => goToURL("https://github.com/paperplane110/next-home")}
              className="font-medium"
            >
              <span className="icon-[logos--github-icon] size-4" />
              <span>Github Repository: next-home</span>
            </CommandItem>
            <CommandItem
              key="deploy"
              value="Vercel"
              keywords={["deploy", "vercel", "next-home"]}
              onSelect={() => goToURL("https://vercel.com/paperplane110s-projects/next-home")}
              className="font-medium"
            >
              <span className="icon-[logos--vercel-icon] size-4" />
              <span>Vercel</span>
            </CommandItem>
            <CommandItem
              key="blob"
              value="Vercel Blob Storage"
              keywords={["blob", "storage", "vercel"]}
              onSelect={() => goToURL("https://vercel.com/paperplane110s-projects/next-home/stores/blob/store_neuL1shzdDwVm3wD/browser")}
              className="font-medium"
            >
              <DatabaseIcon className="size-4 text-orange-400" />
              <span>Vercel Blob Storage</span>
            </CommandItem>
            <CommandItem
              key="db"
              value="Neon DB"
              keywords={["database", "db", "neon"]}
              onSelect={() => goToURL("https://console.neon.tech/app/projects/bold-hill-91359463?branchId=br-restless-term-ahc8j6t2")}
              className="font-medium"
            >
              <span className="icon-[logos--neon-icon] size-4" />
              <span>Neon DB</span>
            </CommandItem>
            <CommandItem
              key="gsc"
              value="Google Search Console SEO"
              keywords={["google", "seo", "search console"]}
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
