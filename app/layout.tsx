import type { Metadata } from "next";
import "./globals.css";

import { getTagsAction } from "@/feature/tag/actions";
import { fontVariables } from "@/lib/fonts";
import { RootProviders } from "@/components/providers/root-providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://tyyuan.me"),
  title: {
    default: "Tianyu",
    template: "%s | Tianyu",
  },
  description: "Tianyu's personal blog about software, reading, and side projects.",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    siteName: "Tianyu",
    url: "https://tyyuan.me",
    title: "Tianyu",
    description: "Tianyu's personal blog about software, reading, and side projects.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tianyu",
    description: "Tianyu's personal blog about software, reading, and side projects.",
  },
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
