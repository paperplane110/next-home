"use client";

import Link from "next/link";
import { Check, Languages } from "lucide-react";
import { usePathname } from "next/navigation";

import { LOCALES, type Locale } from "@/lib/i18n";
import {
  getOdysseyCopy,
  getOdysseyHrefForLocaleFromPathname,
  getOdysseyLocale,
} from "@/lib/odyssey-i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface OdysseyLocaleSwitcherProps {
  className?: string;
}

export function OdysseyLocaleSwitcher({
  className,
}: OdysseyLocaleSwitcherProps) {
  const pathname = usePathname();
  const locale = getOdysseyLocale(pathname);
  const copy = getOdysseyCopy(locale);

  const options: Array<{ locale: Locale; label: string; href: string }> = LOCALES.map(
    (optionLocale) => ({
      locale: optionLocale,
      label: optionLocale === "zh" ? copy.languageZh : copy.languageEn,
      href: getOdysseyHrefForLocaleFromPathname(pathname, optionLocale),
    })
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          aria-label={copy.languageLabel}
          title={copy.languageLabel}
          size="icon-sm"
          variant="ghost"
          className={cn(
            "data-[state=open]:bg-neutral-100 data-[state=open]:text-neutral-900",
            className
          )}
        >
          <Languages className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-32">
        {options.map((option) => {
          const isActive = option.locale === locale;

          return (
            <DropdownMenuItem key={option.locale} asChild>
              <Link
                href={option.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "cursor-pointer",
                  isActive && "font-medium text-neutral-900"
                )}
              >
                {option.label}
                <Check className={cn("ml-auto size-4", !isActive && "invisible")} />
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function OdysseyLocaleSwitcherDefault() {
  return <OdysseyLocaleSwitcher />;
}
