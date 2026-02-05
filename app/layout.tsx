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
  let tagOptions: { label: string; value: string }[] = [];
  try {
    const tags = await getTagsAction();
    tagOptions = tags.map(tag => ({
      label: tag.name,
      value: tag.id,
    }));
  } catch (error) {
    console.error("Failed to fetch tags:", error);
  }
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
