import Link from "next/link";
import { BookOpen } from "lucide-react";

import { OdysseySidebar } from "@/components/odyssey/odyssey-sidebar";
import { OdysseyNavigation } from "@/components/odyssey/odyssey-navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import { getOdysseyCopy, getOdysseyHomeHref } from "@/lib/odyssey-i18n";

export function OdysseyLayoutFrame({
  children,
  locale = DEFAULT_LOCALE,
}: {
  children: React.ReactNode;
  locale?: Locale;
}) {
  const copy = getOdysseyCopy(locale);

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900">

      {/* Navigation */}
      <OdysseyNavigation locale={locale} />

      <div className="w-full mx-auto min-h-0 flex">
        {/* Sidebar */}
        <div className="hidden lg:block shrink-0 w-[260px]">
          <aside
            className={cn(
              "w-full flex-col text-neutral-700 sticky z-30 h-[calc(85svh)] overflow-hidden overscroll-none bg-transparent md:flex",
              "top-[calc(var(--header-height,4rem)+0.6rem)] md:top-[calc(4rem+0.6rem)]",
              "[--sidebar-menu-width:--spacing(56)]"
            )}
          >
            <div className="py-6 lg:pl-6 min-h-0 h-full overflow-hidden flex flex-col">
              <OdysseySidebar />
            </div>
          </aside>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <main className="min-w-0 w-full">
            <div className="w-full">{children}</div>
          </main>

          {/* Second Footer */}
          <div className="md:hidden shrink-0 border-t border-neutral-200/70 bg-white/50 backdrop-blur px-4 sm:px-6 lg:px-8">
            <div className="py-4 flex flex-wrap gap-2 items-center justify-between">
              <Link
                href="/"
                className="text-xs text-neutral-500 hover:text-odyssey"
              >
                ← {copy.backToBlog}
              </Link>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="cursor-pointer"
              >
                <Link href={getOdysseyHomeHref(locale)}>
                  <BookOpen className="size-3.5 mr-1.5" />
                  {copy.wikiButton}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-neutral-200/70">
        <div className="py-6 px-8 flex flex-col sm:flex-row items-start sm:items-center justify-center gap-2 text-xs text-neutral-500">
          <p className="flex items-center gap-1">
            <span className="text-lg sm:text-xs  font-semibold odyssey-gradient-linear">
              {copy.footerTitle}
            </span>
          </p>
          <p className="hidden sm:block">·</p>
          <p>
            © {new Date().getFullYear()} {copy.footerLicense}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function TheOdysseyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OdysseyLayoutFrame locale={DEFAULT_LOCALE}>{children}</OdysseyLayoutFrame>;
}

