import { Suspense } from "react";
import { ReadingsSection, ReadingsSectionSkeleton } from "./readings-section";

export const metadata = {
  title: "Reading",
  description: "Book reviews and reading notes by Tianyu.",
  alternates: { canonical: "/reading" },
  openGraph: {
    type: "website",
    title: "Reading | Tianyu",
    url: "https://tyyuan.me/reading",
    description: "Book reviews and reading notes by Tianyu.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reading | Tianyu",
    description: "Book reviews and reading notes by Tianyu.",
  },
};

export default function Reading() {
  return (
    <div className="section font-serif">
      <div className="subsection page-top-margin">
        <h1 className="headline font-light soft-70">
          Reading
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
