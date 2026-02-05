import type { Metadata } from "next";
import "./globals.css";

import { getTagsAction } from "@/feature/tag/actions";
import { fontVariables } from "@/lib/fonts";
import { RootProviders } from "@/components/providers/root-providers";

export const metadata: Metadata = {
  title: "Tianyu",
  description: "Tianyu's blog",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tags = await getTagsAction();
  const tagOptions = tags.map(tag => ({
    label: tag.name,
    value: tag.id,
  }))
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${fontVariables}
          antialiased
        `}
      >
        <RootProviders tagOptions={tagOptions}>
          {children}
        </RootProviders>
      </body>
    </html>
  );
}
