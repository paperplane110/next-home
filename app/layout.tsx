import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Inter, JetBrains_Mono, Fraunces } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

import { authClient } from "@/feature/auth/client";
import { NeonAuthUIProvider } from "@neondatabase/auth/react"
import { ReactLenis } from "lenis/react"
import { FrameProvider } from "@/components/frame-context";
import { Frame } from "@/components/frame";
import PaperBg from "@/components/paper-bg";
import { PhotoUploadDialog } from "@/feature/photo/components/upload-dialog";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Tianyu",
  description: "Tianyu's blog",
};

// FONT FAMILY
// sans-serif
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
// mono
const jetbrains_mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });
// serif
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT"],
});
const pingXianZhenSong = localFont({
  src: "./fonts/pxzs/pingxianzhensong.ttf",
  variable: "--font-ping-xian-zhen-song",
})
// pixel
const departure_mono = localFont({
  src: "./fonts/DepartureMono/DepartureMono-Regular.woff2",
  variable: "--font-departrue-mono",
})
const zpix = localFont({
  src: "./fonts/zpix.ttf",
  variable: "--font-zpix",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${inter.variable} 
          ${jetbrains_mono.variable} 
          ${fraunces.variable} 
          ${pingXianZhenSong.variable}
          ${departure_mono.variable}
          ${zpix.variable}
          antialiased
        `}
      >
        <NeonAuthUIProvider authClient={authClient}>
          <ReactLenis root options={{
            lerp: 0.1,
            duration: 1.2,
            smoothWheel: true,
          }}>
            <FrameProvider>
              {/* <ControlPanel /> */}
              <PhotoUploadDialog />
              <Frame />
              {children}
            </FrameProvider>
            <Toaster />
            <PaperBg />
            <Analytics />
          </ReactLenis>
        </NeonAuthUIProvider>
      </body>
    </html>
  );
}
