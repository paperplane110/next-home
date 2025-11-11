import Link from "next/link";
import { allReadings } from "content-collections";
import { MDXContent } from "@content-collections/mdx/react"
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { BlockQuote } from "@/components/mdx/block-quote";
import { A } from "@/components/mdx/a";
import { Tips } from "@/components/mdx/tips";

function PostContent({ slug }: { slug: string }) {
  const post = allReadings.find((post) => post._meta.path === slug);
  
  if (!post) {
    notFound();
  }

  return (
    <article>
      <header className="page-top-margin sm:pb-8 section">
        <div className="subsection">
          <h1 className="text-4xl sm:text-5xl font-medium font-serif soft-60 mb-6">{post.title}</h1>
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
                  href={`/reading?tag=${tag}`}
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
        <MDXContent 
          code={post.mdx}
          components={{
            blockquote: BlockQuote,
            a: A,
            Tips: ({ children, title }: { children: React.ReactNode, title: string | undefined }) => (
              <Tips title={title}>{children}</Tips>
            ),
          }}
        />
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
    <>
      <PostContent slug={slug} />
    </>
  )
}