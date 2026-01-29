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
          <h1 className="headline font-serif font-light soft-70">Card Contraction on Scroll</h1>
          <p className="mt-8 text-sm font-medium text-muted-foreground">
            卡片组件在滚动时收缩的效果，多用于页面开始时的大图展示
          </p>
          <p className="mt-8 text-sm font-medium text-muted-foreground">Features</p>
          <ul className="mt-2 text-sm text-muted-foreground">
            <li>Animation triggered by Scroll Progress: <OuterLink href="https://motion.dev/docs/react-scroll-animations">Framer Motion</OuterLink></li>
            <li>Inertia Scroll: <OuterLink href="https://lenis.darkroom.engineering/">Lenis</OuterLink></li>
          </ul>
        </header>

        <div className="mt-16 mb-8 subsection">
          <h2 className="font-bold">Demo 1：图像跟随滚动，卡片收缩</h2>
          <div className="mt-6 text-sm font-medium text-muted-foreground">
            当滚动到卡片顶部时，卡片会收缩，同时图像会跟随滚动。
          </div>
          {/* <div id="navbar" className="fixed top-0 z-10 left-0 right-0 h-6 w-full bg-muted">1</div> */}
        </div>

        <HeroContraction />

        <div className="mt-16 mb-8 subsection">
          <h2 className="font-bold">Demo 2：图像跟随滚动，卡片放大</h2>
          <div className="mt-6 text-sm font-medium text-muted-foreground">
            <p>当卡片向上滚动，卡片会放大，到中央时最大。</p>
            <p className="mt-2">
              细节：容器使用横向 flex 布局，为避免内部卡片高度变高，导致在视觉上卡片向上移动的错觉，
              使用了 items-start 对齐方式，让卡片一直顶在容器最上侧。
            </p>
          </div>
        </div>
      </div>
      <HeroExpansion />
    </ReactLenis>
  );
}