import { notFound } from "next/navigation";

import {
  buildOdysseyEntryMetadata,
  TheOdysseyEntryPage,
} from "@/app/the-odyssey/[slug]/page";
import { isLocale, type Locale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  return buildOdysseyEntryMetadata({
    params: Promise.resolve({ slug }),
    locale: locale as Locale,
  });
}

export async function generateStaticParams() {
  const { allOdysseys } = await import("content-collections");
  const slugs = Array.from(
    new Set(allOdysseys.map((entry) => entry._meta.path.replace(/^(?:zh|en)\//, "")))
  );
  return ["zh", "en"].flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}

export default async function LocalizedOdysseyEntryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  return TheOdysseyEntryPage({
    params: Promise.resolve({ slug }),
    locale: locale as Locale,
  });
}
