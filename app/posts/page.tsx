import { Suspense } from "react";
import { PostsSection, PostsSectionSkeleton } from "./posts-section";

export default function Posts() {
  return (
    <div className="section pt-16 font-serif">
      <div className="subsection pt-12 sm:pt-16">
        <h1 className="headline">Writting</h1>
      </div>
      <div id="desc" className="subsection pt-8">
        <p>
          仔细想想，<br />
          得以存在便是一个奇迹，能够思考就是一件乐事。
        </p>
      </div>
      <Suspense fallback={<PostsSectionSkeleton />}>
        <PostsSection />
      </Suspense>
    </div>
  )
}