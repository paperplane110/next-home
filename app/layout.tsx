import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Fraunces } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

import { FrameProvider } from "@/components/frame-context";
import { Frame } from "@/components/frame";
import ControlPanel from "@/components/control-panel";
import { Navigation } from "@/components/navigation";

export const metadata: Metadata = {
  title: "Tianyu",
  description: "Tianyu's blog",
};

// FONT FAMILY
// sans-serif
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
// mono
const jetbrains_mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });
// serif
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });
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
    <html lang="en">
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
        <FrameProvider>
          <ControlPanel />
          <Frame />
          <Navigation />
          {children}
        </FrameProvider>
      </body>
    </html>
  );
}
