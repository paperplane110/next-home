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

export const fontVariables = `
  ${inter.variable} 
  ${jetbrains_mono.variable} 
  ${fraunces.variable} 
  ${crimsonPro.variable}
  ${pingXianZhenSong.variable}
  ${departure_mono.variable}
  ${zpix.variable}
`;
