"use client"
import { Experiment1 } from "./components/e1";
import { Experiment2A } from "./components/e2-a";
import { Experiment2B } from "./components/e2-b";
import { Experiment4 } from "./components/e4";

export default function ImageExpandAnimationPage() {
  return (
    <div className="page-top-margin sm:pb-8 section">
      <header className="subsection">
        <h1 className="headline font-serif font-light soft-70">Experiment with Layout Animation</h1>
        <p className="mt-8 text-sm font-medium text-muted-foreground">

        </p>
      </header>
      <Experiment1 />


      <div className="subsection mt-32">
        <h2 className="font-bold text-2xl">Experiment 2: AnimatePresence</h2>
        <Experiment2A />
        <hr className="w-full my-8" />
        <Experiment2B />
      </div>
      <div className="subsection mt-16">
        <h2 className="font-bold">Experiment 4: Multi elements layout animation</h2>
        <Experiment4 />
      </div>
    </div>
  )
}