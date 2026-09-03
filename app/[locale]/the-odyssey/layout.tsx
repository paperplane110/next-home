import { notFound } from "next/navigation";

import { OdysseyLayoutFrame } from "@/app/the-odyssey/layout";
import { isLocale, type Locale } from "@/lib/i18n";

export default async function LocalizedOdysseyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <OdysseyLayoutFrame locale={locale as Locale}>{children}</OdysseyLayoutFrame>;
}
