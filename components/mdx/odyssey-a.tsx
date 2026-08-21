import OdysseyInlineLink from "@/components/odyssey/odyssey-inline-link";
import { A } from "@/components/mdx/a";
import { getEntryBySlug } from "@/lib/odyssey";

type Props = React.ComponentProps<"a"> & {
  children: React.ReactNode;
  href: string;
};

function getOdysseyEntryFromHref(href: string) {
  const prefix = "/the-odyssey/";
  if (!href.startsWith(prefix)) return undefined;

  const slug = href.slice(prefix.length).split(/[?#]/)[0];
  if (!slug) return undefined;

  return getEntryBySlug(slug);
}

export const OdysseyA = ({ children, href, className }: Props) => {
  const odysseyEntry = getOdysseyEntryFromHref(href);

  if (!odysseyEntry) {
    return (
      <A href={href} className={className}>
        {children}
      </A>
    );
  }

  return (
    <OdysseyInlineLink href={href} entry={odysseyEntry}>
      {children}
    </OdysseyInlineLink>
  );
};
