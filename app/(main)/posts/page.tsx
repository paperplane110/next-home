import { Suspense } from "react";
import { PostsSection, PostsSectionSkeleton } from "./posts-section";

export const metadata = {
  title: "Posts",
  description: "All articles and technical writing by Tianyu.",
  alternates: { canonical: "/posts" },
  openGraph: {
    type: "website",
    title: "Posts | Tianyu",
    url: "https://tyyuan.me/posts",
    description: "All articles and technical writing by Tianyu.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Posts | Tianyu",
    description: "All articles and technical writing by Tianyu.",
  },
};

export default function Posts() {
  return (
    <div className="section font-serif">
      <div className="subsection page-top-margin">
        <h1 className="headline font-light soft-70">
          Writing
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
