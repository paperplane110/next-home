import OdysseyInlineLink from "@/components/odyssey/odyssey-inline-link";
import { A } from "@/components/mdx/a";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import { getEntryBySlug } from "@/lib/odyssey";
import { getLocaleAwareOdysseyHref } from "@/lib/odyssey-i18n";

type Props = React.ComponentProps<"a"> & {
  children?: React.ReactNode;
  href?: string;
  locale?: Locale;
};

function getOdysseyEntryFromHref(href: string, locale: Locale) {
  const normalized = href
    .replace(/^\/(?:zh|en)\/the-odyssey\//, "")
    .replace(/^\/the-odyssey\//, "")
    .split(/[?#]/)[0];
  if (!normalized || normalized === href) return undefined;

  return getEntryBySlug(normalized, locale);
}

export const OdysseyA = ({ children, href, className, locale = DEFAULT_LOCALE }: Props) => {
  if (!href) {
    return <>{children}</>;
  }

  const localizedHref = getLocaleAwareOdysseyHref(href, locale);
  const odysseyEntry = getOdysseyEntryFromHref(href, locale);

  if (!odysseyEntry) {
    return (
      <A href={localizedHref} className={className}>
        {children}
      </A>
    );
  }

  return (
    <OdysseyInlineLink href={localizedHref} entry={odysseyEntry} locale={locale}>
      {children}
    </OdysseyInlineLink>
  );
};
