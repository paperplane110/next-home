import Link from "next/link";
import { allPosts } from "content-collections";
import { MDXContent } from "@content-collections/mdx/react"
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";

function PostContent({ slug }: { slug: string }) {
  const post = allPosts.find((post) => post._meta.path === slug);
  
  if (!post) {
    notFound();
  }

  return (
    <article>
      <header className="mt-16 mb-8 section">
        <div className="subsection">
          <h1 className="headline font-serif font-medium mb-6">{post.title}</h1>
          <p className="text-sm text-muted-foreground mb-4">
            {post.summary}
          </p>
          <div className="flex items-center">
            <time className="text-sm text-muted-foreground">
              {new Date(post.date).toLocaleDateString('sv-SE')}
            </time>
            <span className="mx-2">·</span>
            <span className="text-sm text-muted-foreground">
              {post.readingTime} min read
            </span>
            <span className="mx-2">·</span>
            <div className="flex items-center gap-x-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/posts?tag=${tag}`}
                >
                  <Badge
                    variant="secondary"
                    className="text-muted-foreground"
                  >
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>
      <div className="mdx-content">
        <MDXContent code={post.mdx} />
      </div>
    </article>
  );
}

export default async function PostPage({ 
  params 
}: { 
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;

  return (
    <div className="pt-16">
      <PostContent slug={slug} />
    </div>
  )
}