"use client"

import { useState } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { allPosts } from "content-collections";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function Posts() {
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

  const tags = ["All"].concat([...new Set(posts.flatMap(post => post.tags))].sort());
  // const years = [...new Set(posts.map(post => format(new Date(post.date), "yyyy")))];

  const filteredPosts = posts
    .filter(post => selectedTag === "All" || post.tags.includes(selectedTag))
    .filter(post => selectedYear === "" || format(new Date(post.date), "yyyy") === selectedYear);

  const convertDate = (date: string): string => {
    return format(new Date(date), "LLL/dd")
  }

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
      <div id="tags" className="subsection pt-8 flex flex-wrap gap-2">
        {tags.map((tag, index) => {
          return (
            <Badge
              key={index}
              variant={selectedTag === tag ? "default" : "secondary"}
              onClick={() => handleFilter(tag)}
              className={cn(
                "inline-block transition-none text-muted-foreground cursor-pointer",
                selectedTag === tag ? "text-white" : ""
              )}
            >
              {tag}
            </Badge>
          );
        })}
      </div>
      <div id="posts" className="subsection pt-8 flex flex-col items-between">
        {filteredPosts.map((post, index) => {
          const year = format(new Date(post.date), "yyyy");
          return (
            <div key={index}>
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
                    <div className="cursor-pointer hover:text-pink-600" onClick={() => handleFilter(undefined, "")}>Back</div>
                  )}
                </div>
              )}
              <Link
                href={`/posts/${post._meta.path}`}
                className="flex justify-between group py-1"
              >
                <div className="group-hover:underline decoration-pink-600">
                  {post.title}
                </div>
                {/* <div className="flex-1 flex items-center px-4">
                    <div className="w-full h-[2px] group-hover:bg-muted-foreground/20"></div>
                  </div> */}
                <div className="flex items-center gap-2">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => {
                      return (
                        <Badge key={index} variant="secondary" className="text-muted-foreground">
                          {tag}
                        </Badge>
                      );
                    })}
                  </div>
                  <p className="text-xs font-mono text-muted-foreground group-hover:text-pink-600">
                    {convertDate(post.date.toString())}
                  </p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  )
}