"use client"

import { useState } from "react";
import { useMedia } from "react-use";

export default function YearProgress() {
  const isMobile = useMedia("(max-width: 600px)", true);
  // calculate the how much progress we have made this year
  const [now, setNow] = useState(() => new Date());
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  const currentWeek = Math.floor(diff / oneWeek);
  const leftOffset = (currentWeek * 6.38 + 1 + 6.4).toFixed(0);

  const progressLeftOffset = (currentWeek * 6.38 + 6.34 + 10).toFixed(0);
  const progress = (diff / (1000 * 60 * 60 * 24 * 365) * 100).toFixed(1)

  const nowDate = now.toDateString().split(" ").slice(1, 3).join(",")
  // const dateLeftOffset = (currentWeek * 6.38 - 10).toFixed(0);

  return (
    <span className="relative">
      <span className="font-pixel text-[10px]">
        [{
          [...Array(52)].map((_, i) => (
            <span key={i} className="h-full">
              {i <= currentWeek ? '#' : '='}
            </span>
          ))
        }]
      </span>
      <span id="cursor"
        className="absolute -top-[7px] text-[11px] text-primary font-pixel leading-tight"
        style={{ left: `${leftOffset}px` }}
      >
        &#x25BC;
      </span>
      <span
        className="absolute -top-2 font-sans text-[10px] text-black"
        style={{ left: `${progressLeftOffset}px` }}
      >{progress}%{isMobile && ` ${nowDate}`}</span>
      <span
        id="date"
        className="absolute -top-5.5 font-sans text-[10px] text-black"
        style={{ left: `${progressLeftOffset}px` }}
      >
        {!isMobile && nowDate}
      </span>
    </span>
  )
}