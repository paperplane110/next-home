"use client"

import { useState, useMemo } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { allPosts } from "content-collections";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Undo2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ArticleTag } from "@/components/article-tag";
import { Separator } from "@/components/ui/separator";
import { PostItem } from "@/components/post-item";

// PostsSection component
// Extract useSearchParams from page level component.
export const PostsSection = () => {

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const defaultTag = searchParams.get("tag") || "All";
  const defaultYear = searchParams.get("year") || "";

  const [selectedTag, setSelectedTag] = useState(defaultTag);
  const [selectedYear, setSelectedYear] = useState(defaultYear);

  // sort by year: Latest -> Oldest
  const posts = allPosts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const tags: Record<string, number> = {};
  posts.forEach(post => {
    post.tags.forEach(tag => {
      if (tags[tag]) {
        tags[tag]++;
      } else {
        tags[tag] = 1;
      }
    })
  })
  const sortedTags = Object.fromEntries(
    Object.entries(tags).sort((a, b) => b[1] - a[1])
  )

  const filteredPosts = useMemo(() => {
    return posts
      .filter(post => selectedTag === "All" || post.tags.includes(selectedTag))
      .filter(post => selectedYear === "" || format(new Date(post.date), "yyyy") === selectedYear);
  }, [selectedTag, selectedYear, posts]);

  // mark the first post of each year, for display the year interval.
  let currYear = "";
  const yearIntervalIndex: Record<string, number> = {};
  filteredPosts.forEach((post, index) => {
    const year = format(new Date(post.date), "yyyy");
    if (year !== currYear) {
      currYear = year;
      yearIntervalIndex[year] = index;
    }
  });


  const handleFilter = (tag?: string, year?: string) => {
    const params = new URLSearchParams(searchParams);
    if (tag) {
      setSelectedTag(tag);
      if (tag === "All") {
        params.delete("tag");
      } else {
        params.set("tag", tag);
      }
    }
    if (year !== undefined) {
      setSelectedYear(year);
      if (year === "") {
        params.delete("year");
      } else {
        params.set("year", year);
      }
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <>
      {/* tags filter */}
      <div id="tags" className="subsection mt-8 flex flex-wrap items-center gap-2">
        <ArticleTag
          tag="All"
          count={allPosts.length}
          isActivated={selectedTag === "All"}
          onClick={() => handleFilter("All")}
        />
        <div className="h-4">
          <Separator orientation="vertical" />
        </div>
        {Object.entries(sortedTags).map(([tag, count], index) => {
          return (
            <ArticleTag
              key={index}
              tag={tag}
              count={count}
              isActivated={selectedTag === tag}
              onClick={() => handleFilter(tag)}
            />
          );
        })}
      </div>
      <div id="posts" className="subsection pt-8 flex flex-col items-between">
        {filteredPosts.map((post, index) => {
          const year = format(new Date(post.date), "yyyy");
          return (
            <div key={index}>

              {/* year interval */}
              {index === yearIntervalIndex[year] && (
                <div
                  id={`year-${year}`}
                  className={cn(
                    "flex justify-between mb-2 text-xs font-mono text-muted-foreground border-b",
                    index !== 0 && "mt-4"
                  )}
                >
                  <p className={cn("cursor-pointer hover:text-pink-600", selectedYear === year && "text-pink-600")} onClick={() => handleFilter(undefined, year)}>{year}</p>
                  {selectedYear !== "" && (
                    <div className="flex items-center gap-1 cursor-pointer hover:text-pink-600" onClick={() => handleFilter(undefined, "")}>
                      <Undo2 className="-translate-y-px" size={12} />Back</div>
                  )}
                </div>
              )}

              {/* post item */}
              <PostItem post={post} />
            </div>
          );
        })}
      </div>
    </>
  )
}


export const PostsSectionSkeleton = () => {
  return (
    <>
      <div className="subsection pt-8 flex flex-wrap gap-2">
        {[...Array(5)].map((_, index) => (
          <Skeleton key={index} className="w-[48px] h-[24px]">
          </Skeleton>
        ))}
      </div>
      <div className="subsection pt-8">
        <Skeleton className="w-full h-[400px]" />
      </div>
    </>
  )
}