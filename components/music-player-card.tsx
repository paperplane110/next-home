"use client";
import { useState, useRef } from "react";
import { useMedia } from "react-use";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { BlackVinyl } from "./disk";
import { format } from "date-fns";


export const MusicPlayerCard = () => {
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isMobile = useMedia("(max-width: 768px)", true)
  const songList = [
    "Guess Who I Saw Today",
    "The Risk",
    "May Ninth",
    "Manchild",
  ]
  const genreList = [
    "Blues",
    "Pyschedelia",
    "Pop",
  ]
  const lastUpdateDate = format(new Date("2025-10-25"), "MMMM d, yyyy")

  const handleIframeLoad = () => {
    // 模拟加载延迟，确保加载完成后显示 iframe
    setTimeout(() => {
      setIsIframeLoaded(true);
    }, 500);
  }

  return (
    <div className="border border-accent px-0.5 pt-0.5 rounded-lg shadow-xs">
      <div className="border border-accent p-2 rounded-md flex">
        <div className="relative group/album-cover">
          {!isIframeLoaded && <div className="z-5 absolute w-[66px] h-[66px] rounded-md bg-accent scale-105" />}
          <div id="album-cover" className="z-4 relative w-[66px] h-[66px] rounded-md overflow-hidden">
            <iframe
              ref={iframeRef}
              onLoad={() => handleIframeLoad()}
              className="absolute -top-2.5 -left-2.5 filter brightness-150"
              title="Song List Player"
              referrerPolicy="no-referrer"
              width={86}
              height={86}
              src="https://music.163.com/outchain/player?type=0&id=14462387674&auto=1&height=66"
            >
            </iframe>
          </div>
          <div className="absolute top-1 group-hover/album-cover:-translate-x-10 transition-transform">
            {isIframeLoaded && <BlackVinyl />}
            {/* <Disk /> */}
          </div>
        </div>
        <div className="flex-1 ml-4 flex flex-col justify-center">
          <div className="text-sm font-medium mb-1">
            Daily Song List
            {!isMobile && genreList.map((genre) => (
              <Badge variant="secondary" className="ml-2" key={genre}>{genre}</Badge>
            ))}
          </div>
          <div className="text-xs text-gray-500 line-clamp-1">{songList.join(" / ")}</div>
        </div>
        <div className="pt-1 pr-1">
          <Link href="https://music.163.com/playlist?id=14462387674&uct2=U2FsdGVkX187JEmhGHEnN5PVzWURqnMQBbcQSG2a5/Y=">
            <Image
              src="/neteast_music.svg"
              alt="neteast music"
              width={20}
              height={20}
              className="bg-[#ff1b29] hover:bg-[#ff1b29]/60 p-[0.15rem] rounded-full transition-colors ease-in-out"
            />
          </Link>
        </div>
      </div>
      <div className="flex items-center py-1 pl-2">
        <span className="inline-block w-[5px] h-[5px] rounded-full bg-pink-500 dot-breath"></span>
        <p className="ml-2 font-sans text-[10px] text-gray-400">Last updated on {lastUpdateDate}</p>
      </div>
    </div>
  )
}