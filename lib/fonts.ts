import { Inter, JetBrains_Mono, Fraunces, Crimson_Pro } from "next/font/google";
import localFont from "next/font/local";

// sans-serif
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// mono
export const jetbrains_mono = JetBrains_Mono({ 
  subsets: ["latin"], 
  variable: "--font-jetbrains-mono" 
});

// serif
export const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT"],
});

export const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  variable: "--font-crimson-pro",
})

export const pingXianZhenSong = localFont({
  src: "../app/fonts/pxzs/pingxianzhensong.ttf",
  variable: "--font-ping-xian-zhen-song",
});

// pixel
export const departure_mono = localFont({
  src: "../app/fonts/DepartureMono/DepartureMono-Regular.woff2",
  variable: "--font-departure-mono",
});

export const zpix = localFont({
  src: "../app/fonts/zpix.ttf",
  variable: "--font-zpix",
});

export const open_runde = localFont({
  src: [
    {
      path: "../app/fonts/open-runde-1.0.1/src/web/OpenRunde-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../app/fonts/open-runde-1.0.1/src/web/OpenRunde-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../app/fonts/open-runde-1.0.1/src/web/OpenRunde-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../app/fonts/open-runde-1.0.1/src/web/OpenRunde-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-open-runde",
})

export const fontVariables = `
  ${inter.variable} 
  ${jetbrains_mono.variable} 
  ${fraunces.variable} 
  ${crimsonPro.variable}
  ${pingXianZhenSong.variable}
  ${departure_mono.variable}
  ${zpix.variable}
  ${open_runde.variable}
`;
