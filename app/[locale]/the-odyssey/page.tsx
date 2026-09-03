import { notFound } from "next/navigation";

import { TheOdysseyHomePage, buildOdysseyHomeMetadata } from "@/app/the-odyssey/page";
import { isLocale, type Locale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return buildOdysseyHomeMetadata(locale as Locale);
}

export default async function LocalizedOdysseyHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <TheOdysseyHomePage locale={locale as Locale} />;
}
