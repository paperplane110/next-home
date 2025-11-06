import { Suspense } from "react";
import { ReadingsSection, ReadingsSectionSkeleton } from "./readings-section";

export default function Reading() {
  return (
    <div className="section font-serif">
      <div className="subsection page-top-margin">
        <h1 className="headline font-light soft-70">
          Reading<span className="text-pink-600">.</span>
        </h1>
      </div>
      <div id="desc" className="subsection pt-8 text-muted-foreground">
        <p>
          通过阅读，<br />
          理解更复杂的世界
        </p>
      </div>
      <Suspense fallback={<ReadingsSectionSkeleton />}>
        <ReadingsSection />
      </Suspense>
    </div>
  )
}