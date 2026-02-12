import Link from "next/link";
import { allReadings } from "content-collections";
import { MDXContent } from "@content-collections/mdx/react"
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { BlockQuote } from "@/components/mdx/block-quote";
import { A } from "@/components/mdx/a";
import { Tips } from "@/components/mdx/tips";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = allReadings.find((p) => p._meta.path === slug);
  if (!post) {
    return {};
  }
  const url = `https://tyyuan.me/reading/${slug}`;
  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `/reading/${slug}` },
    robots: { index: true, follow: true },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary,
      url,
      publishedTime: new Date(post.date).toISOString(),
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
    },
  };
}

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.summary,
            datePublished: new Date(post.date).toISOString(),
            author: { "@type": "Person", name: "Tianyu" },
            mainEntityOfPage: { "@type": "WebPage", "@id": `https://tyyuan.me/reading/${slug}` },
            keywords: post.tags.join(", "),
          }),
        }}
      />
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
