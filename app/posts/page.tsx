import { Suspense } from "react";
import { PostsSection, PostsSectionSkeleton } from "./posts-section";

export default function Posts() {
  return (
    <div className="section pt-14 font-serif">
      <div className="subsection pt-10 sm:pt-16">
        <h1 className="headline font-light soft-70">
          Writing<span className="text-pink-600">.</span>
        </h1>
      </div>
      <div id="desc" className="subsection pt-8 text-muted-foreground">
        <p>
          仔细想想，<br />
          得以存在便是一个奇迹，能够思考就是一件乐事
        </p>
      </div>
      <Suspense fallback={<PostsSectionSkeleton />}>
        <PostsSection />
      </Suspense>
    </div>
  )
}