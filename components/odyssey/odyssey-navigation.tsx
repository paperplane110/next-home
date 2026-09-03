"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, ChevronRight, Languages, MenuIcon, Undo2Icon } from "lucide-react";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fraunces } from "@/lib/fonts";
import { HelperCommand } from "@/components/helper-command";
import { OdysseyLocaleSwitcher } from "@/components/odyssey/odyssey-locale-switcher";
import { DEFAULT_LOCALE, getAlternateLocale, type Locale } from "@/lib/i18n";
import {
  ODYSSEY_CATEGORIES,
  getEntriesByCategory,
  getEntrySlug,
  getOdysseyEntryDisplayTitle,
} from "@/lib/odyssey";
import {
  getOdysseyCategoryLabel,
  getOdysseyCopy,
  getOdysseyEntryHref,
  getOdysseyHomeHref,
  getOdysseyHrefForLocaleFromPathname,
  getOdysseyLocale,
} from "@/lib/odyssey-i18n";
import { Separator } from "@/components/ui/separator";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";

export function OdysseyNavigation({
  locale = DEFAULT_LOCALE,
}: {
  locale?: Locale;
}) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const copy = getOdysseyCopy(locale);
  const odysseyLocale = getOdysseyLocale(pathname);
  const alternateOdysseyLocale = getAlternateLocale(odysseyLocale);

  useEffect(() => setIsMounted(true), []);

  // 路由变化（点击链接、切换语言）时收起抽屉
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 shrink-0 border-b border-neutral-200/70 bg-white/80 backdrop-blur-md",
        "transition-opacity",
        !isMounted && "opacity-0"
      )}
    >
      <div className="w-full mx-auto px-6">
        <div className="h-16 flex items-center gap-4 w-full">
          {/* 移动端：侧边栏链接收进 Drawer */}
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerTrigger asChild>
              <Button
                size="icon-sm"
                variant="ghost"
                aria-label={copy.navMenuLabel}
                title={copy.navMenuLabel}
                className="lg:hidden cursor-pointer shrink-0 shadow-none"
              >
                <MenuIcon size={16} />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-[80svh]" data-lenis-prevent>
              <div className="min-h-0 flex-1 overflow-y-auto flex flex-col gap-y-1 px-4 pt-2">
                <DrawerClose asChild>
                  <Link
                    href={getOdysseyHomeHref(locale)}
                    className="flex items-center"
                  >
                    <Button variant="ghost" className="w-full">
                      <BookOpen className="mr-0.5 text-odyssey" size={16} />
                      {copy.wikiButton}
                      <ChevronRight className="ml-auto text-odyssey" size={16} />
                    </Button>
                  </Link>
                </DrawerClose>
                <DrawerClose asChild>
                  <Link href="/" className="flex items-center">
                    <Button variant="ghost" className="w-full">
                      <Undo2Icon className="mr-0.5 text-odyssey" size={16} />
                      {copy.backToBlog}
                      <ChevronRight className="ml-auto text-odyssey" size={16} />
                    </Button>
                  </Link>
                </DrawerClose>
                <DrawerClose asChild>
                  <Link
                    href={getOdysseyHrefForLocaleFromPathname(
                      pathname,
                      alternateOdysseyLocale
                    )}
                    className="flex items-center"
                  >
                    <Button variant="ghost" className="w-full">
                      <Languages className="mr-0.5 text-odyssey" size={16} />
                      {copy.switchLanguageTo}{" "}
                      {alternateOdysseyLocale === "zh"
                        ? copy.languageZh
                        : copy.languageEn}
                      <ChevronRight className="ml-auto text-odyssey" size={16} />
                    </Button>
                  </Link>
                </DrawerClose>
                <Separator className="my-1" />
                {ODYSSEY_CATEGORIES.map((category) => {
                  const entries = getEntriesByCategory(category, locale);
                  if (entries.length === 0) return null;

                  return (
                    <div key={category} className="py-1">
                      <p className="px-3 pb-1 pt-1 text-xs font-semibold text-neutral-400">
                        {getOdysseyCategoryLabel(category, locale)}
                      </p>
                      {entries.map((entry) => (
                        <DrawerClose asChild key={getEntrySlug(entry)}>
                          <Link
                            href={getOdysseyEntryHref(locale, entry)}
                            className="flex items-center"
                          >
                            <Button
                              variant="ghost"
                              className="w-full justify-start text-sm font-normal"
                            >
                              <span className="truncate">
                                {getOdysseyEntryDisplayTitle(entry, locale)}
                              </span>
                              <ChevronRight
                                className="ml-auto shrink-0 text-odyssey"
                                size={16}
                              />
                            </Button>
                          </Link>
                        </DrawerClose>
                      ))}
                    </div>
                  );
                })}
                <Separator className="mt-2" />
              </div>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="outline" className="w-full shadow-none">
                    {copy.navCloseLabel}
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>

          <Link
            href={getOdysseyHomeHref(locale)}
            className="flex items-center gap-2 shrink-0 group"
          >
            <div className="flex flex-col leading-tight">
              <span
                className={cn(
                  "text-base font-semibold tracking-tight",
                  fraunces.className
                )}
              >
                {copy.layoutTitle}
              </span>
              <span className="text-[11px] text-neutral-500 -mt-0.5">
                {copy.layoutSubtitle}
              </span>
            </div>
          </Link>

          <div className="hidden  ml-auto sm:flex items-center gap-2 shrink-0">
            <HelperCommand />
            <Separator orientation="vertical" />
            <OdysseyLocaleSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
