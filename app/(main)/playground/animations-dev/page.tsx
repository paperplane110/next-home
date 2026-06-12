import OuterLink from "@/components/link";
import { SectionClipPath } from "./components/section-clip-path";
import SectionKeyframeAnimation from "./components/section-keyframe-animation";
import SectionFramerBasic from "./components/section-framer-basic";
import SectionFramerAdvanced from "./components/section-framer-advanced";
import { SectionFeedback } from "./components/section-feedback";
import { SectionMultiStep } from "./components/section-multi-step";
import { SectionTrashAnimation } from "./components/trash-animation/section-trash-animation";
import { SectionHooksAndAnimations } from "./components/section-hooks-and-animations";


export default function AnimationsDev() {
  return (
    <div className="section">
      <header className="page-top-margin subsection">
        <h1 className="headline font-serif font-light soft-70">Animations.Dev</h1>
        <p className="mt-8 text-sm font-medium text-muted-foreground">
          This is a draft page when I&apos;m learning&nbsp;
          <OuterLink href="https://animations.dev/">Animations.Dev</OuterLink>
        </p>
      </header>
      <div className="subsection mt-32">
        <h3 className="text-md font-medium text-muted-foreground">Module 2</h3>
        <h1
          className="text-5xl font-semibold"
          style={{
            fontFamily: "var(--font-crimson-pro)",
          }}>CSS Animations</h1>
        <hr className="my-4" />
      </div>
      <SectionKeyframeAnimation />
      <SectionClipPath />
      <div className="subsection mt-32">
        {/* <div className="size-12 flex items-center justify-center bg-[#fff32c] rounded-xl">
          <div className="size-8 icon-[devicon--motion]">
          </div>
        </div> */}
        <h3 className="text-md font-medium text-muted-foreground mt-4">
          Module 3
        </h3>
        <h1
          className="text-5xl font-semibold"
          style={{
            fontFamily: "var(--font-crimson-pro)",
          }}>Framer Motion</h1>
        <hr className="my-4" />
      </div>
      <SectionFramerBasic />
      <SectionFramerAdvanced />
      <SectionFeedback />
      <SectionMultiStep />
      <SectionTrashAnimation />
      <SectionHooksAndAnimations />
    </div>
  )
}