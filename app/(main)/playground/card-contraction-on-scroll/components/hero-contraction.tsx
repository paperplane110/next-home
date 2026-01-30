"use client"

import { useRef } from "react";
import { useScroll, motion, useTransform } from "framer-motion";
import { thumbHashToDataURL} from "thumbhash"
import { base64ToBinary } from "@/lib/utils";
import Image from "next/image";
import { CircleArrowUpIcon } from "lucide-react";

export function HeroContraction() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    // start when the top of the target meet the top of the viewport
    // end when the bottom of the target meet the top of the viewport
    offset: ["start start", "end start"],
  });

  // 映射剪裁进度：从 0% (全屏) 到 5% (四周缩进 5%，总宽度就是 90%)
  // 映射圆角：从 0px 到 64px
  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    [
      "inset(0% 0% 0% 0% round 0px)", 
      "inset(5% 5% 5% 5% round 64px)"
    ]
  );

  return (
    <div ref={containerRef} className="w-full h-screen mb-[30vh]">
      <div className="relative h-screen w-full flex items-center justify-center">
        <div className="absolute left-[10%] bottom-[10%] text-white z-10">
          <p className="mt-2 font-medium text-7xl">Hallsta<i>tt</i>, <br /><i>A</i>ustria</p>
          <div className="mt-8 grid grid-cols-4 gap-8">
            <div className="flex gap-[0.3rem]">
              <svg className="w-6 h-6 flex-none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="8" fill="transparent" stroke="white" strokeWidth="0.8" />
              </svg>
              <div className="flex-1 flex flex-col gap-y-2 pt-[0.1rem]">
                <div className="text-sm">摄影/<br />Photographer</div>
                <div className="text-2xl">V+</div>
              </div>
            </div>
            <div className="flex gap-[0.3rem]">
              <svg className="w-6 h-6 flex-none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="8" fill="transparent" stroke="white" strokeWidth="0.8" />
              </svg>
              <div className="flex-1 flex flex-col gap-y-2 pt-[0.1rem]">
                <div className="text-sm">队友/<br />Member</div>
                <div className="text-2xl">June</div>
              </div>
            </div>
            <div className="flex gap-[0.3rem]">
              <svg className="w-6 h-6 flex-none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="8" fill="transparent" stroke="white" strokeWidth="0.8" />
              </svg>
              <div className="flex-1 flex flex-col gap-y-2 pt-[0.1rem]">
                <div className="text-sm">队友/<br />Member</div>
                <div className="text-2xl">Ran</div>
              </div>
            </div>
            <div className="flex gap-[0.3rem]">
              <svg className="w-6 h-6 flex-none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="8" fill="transparent" stroke="white" strokeWidth="0.8" />
              </svg>
              <div className="flex-1 flex flex-col gap-y-2 pt-[0.1rem]">
                <div className="text-sm">队友/<br />Member</div>
                <div className="text-2xl">Tianyu</div>
              </div>
            </div>
            <div className="flex gap-[0.3rem]">
              <svg className="w-6 h-6 flex-none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="8" fill="transparent" stroke="white" strokeWidth="0.8" />
              </svg>
              <div className="flex-1 flex flex-col gap-y-2 pt-[0.1rem]">
                <div className="text-sm">日期/<br />2023.10</div>
              </div>
            </div>
          </div>
        </div>
        <motion.div
          style={{
            clipPath,
            overflow: "hidden",
            transform: "translateZ(0)"
          }}
        >
          <Image
            src="https://neul1shzddwvm3wd.public.blob.vercel-storage.com/R0001004%20%281%29-0cK4lL7qhe6erMmNkHlsF48peeFAfE.webp"
            alt="hallstatt"
            width={640}
            height={480}
            priority
            className="w-screen h-screen object-cover"
            placeholder="blur"
            blurDataURL={thumbHashToDataURL(base64ToBinary("WecNHIYiiHhvZod7d4ivd/hbhw=="))}
          />
        </motion.div>
      </div>
      <div className="mt-8">
        <div className="flex items-center justify-center"><CircleArrowUpIcon className="size-10 text-muted-foreground" /></div>
        <div className="mt-6 font-medium text-muted-foreground text-center">
          向上滚动，卡片的宽高缩窄，圆角加大
        </div>
      </div>
    </div>
  );
}
