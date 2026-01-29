"use client"

import { ReactLenis } from "lenis/react"
import OuterLink from "@/components/link";
import { HeroContraction } from "./components/hero-contraction";
import { HeroExpansion } from "./components/hero-expansion";

export default function CardContractionOnScroll() {
  return (
    <ReactLenis root options={{
      lerp: 0.1,
      duration: 1.2,
      smoothWheel: true,
    }}>
      <div className="page-top-margin sm:pb-8 section relative">
        <header className="subsection">
          <h1 className="headline font-serif font-light soft-70">Hero Card Expansion/Contraction on Scroll</h1>
          <p className="mt-8 text-sm font-medium text-muted-foreground">
            卡片组件在滚动时收缩的效果，多用于页面开始时的大图展示
          </p>
          <p className="mt-8 text-sm font-medium text-muted-foreground">Features</p>
          <ul className="mt-2 text-sm text-muted-foreground">
            <li>Animation triggered by Scroll Progress: <OuterLink href="https://motion.dev/docs/react-scroll-animations">Framer Motion</OuterLink></li>
            <li>Inertia Scroll: <OuterLink href="https://lenis.darkroom.engineering/">Lenis</OuterLink></li>
          </ul>
        </header>

        <div className="mt-32 mb-8 subsection">
          <p className="pl-0.5 pb-2 font-bold text-xl">Demo 1</p>
          <h2 className="font-bold text-5xl">图像跟随滚动，卡片收缩</h2>
          <div className="mt-6 font-medium text-muted-foreground">
            当滚动到卡片顶部时，卡片会收缩，同时图像会跟随滚动。
          </div>
          <p className="mt-8 font-medium text-muted-foreground">细节解析</p>
          <ul className="mt-2 text-muted-foreground">
            <li>使用场景一般是放在 page 开始作为 cover-image，随着图片收束产生一种开始的感觉</li>
            <li>图片上的英文，通过夹杂一些 <b>Italic</b> 字体，添加一些动感</li>
          </ul>
          {/* <div id="navbar" className="fixed top-0 z-10 left-0 right-0 h-6 w-full bg-muted">1</div> */}
        </div>

        <HeroContraction />
        <div className="subsection"><hr /></div>

        <div className="mt-16 mb-8 subsection">
          <p className="pl-0.5 pb-2 font-bold text-xl">Demo 2</p>
          <h2 className="font-bold text-5xl">图像跟随滚动，卡片放大</h2>
          <div className="mt-6 font-medium text-muted-foreground">
            <p>当卡片向上滚动，卡片会放大，到中央时最大。</p>
          </div>
        </div>
        <HeroExpansion />
        <div className="subsection"><hr /></div>

        {/* <div className="w-full h-screen grid grid-cols-2">
          <div className="h-screen pl-[15vw] flex flex-col justify-center items-start">
            <p className="pl-0.5 pb-2 font-bold text-xl">Demo 3</p>
            <h2 className="font-bold text-5xl">图像 Sticky，<br/>叠放出现</h2>
            <div className="mt-6 font-medium text-muted-foreground">
              当卡片位于
            </div>
          </div>
        </div>
        <div className="subsection"><hr /></div> */}
      </div>
    </ReactLenis>
  );
}