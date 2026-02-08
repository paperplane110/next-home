"use client"
import OuterLink from "@/components/link";
import { Experiment1 } from "./components/e1";
import { Experiment2A } from "./components/e2-a";
import { Experiment2B } from "./components/e2-b";
import { Experiment2C } from "./components/e2-c";

export default function ImageExpandAnimationPage() {
  return (
    <div className="page-top-margin sm:pb-8 section">
      <header className="subsection">
        <h1 className="headline font-serif font-light soft-70">Experiment with Layout Animation</h1>
        <div className="mt-8 font-medium text-sm text-muted-foreground">
          <p>
            Some experiments about <code>framer-motion</code>&nbsp;
            <OuterLink href="https://motion.dev/docs/react-layout-animations?platform=react">layout animation</OuterLink>&nbsp;
            and <OuterLink href="https://motion.dev/docs/react-animate-presence?platform=react">AnimatePresence</OuterLink>.
          </p>
        </div>
      </header>
      <Experiment1 />

      <div className="subsection mt-32">
        <h2 className="font-bold text-2xl">Experiment 2: AnimatePresence with layoutId</h2>
        <Experiment2C />
        <hr className="w-full my-8" />
        <Experiment2A />
        <hr className="w-full my-8" />
        <Experiment2B />
        <hr className="w-full my-8" />
        <h3 className="font-bold mt-16">§ E2 Summary</h3>
        <div className="mt-8 space-y-6 [&>p+ol]:-mt-4 text-base text-muted-foreground">
          <p>
            <code>AnimatePresence</code> is very suitable for complex layout animation.
          </p>
          <p><strong>Use AnimatePresence when:</strong></p>
          <ul>
            <li>
              The layout transition involves more than a single standlone element
            </li>
            <li>
              The trigger element might be one a fragment within a large, reconfigured layout.
            </li>
            <li>
              To maintain clean styling logic,
              it is preferable to separate the &apos;before&apos; and &apos;after&apos; states into distinct components
              rather than overloading a single element with conflicting styles
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}