"use client"

import { useState } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { allReadings } from "content-collections";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

// PostsSection component
// Extract useSearchParams from page level component.
export const ReadingsSection = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const defaultTag = searchParams.get("tag") || "All";
  const defaultYear = searchParams.get("year") || "";

  const [selectedTag, setSelectedTag] = useState(defaultTag);
  const [selectedYear, setSelectedYear] = useState(defaultYear);

  // sort by year: Latest -> Oldest
  const readings = allReadings.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  const tags: Record<string, number> = {}
  for (const reading of readings) {
    for (const tag of reading.tags) {
      if (tags[tag]) {
        tags[tag]++;
      } else {
        tags[tag] = 1;
      }
    }
  }
  tags["All"] = readings.length;
  const sortedTags = Object.fromEntries(Object.entries(tags).sort((a, b) => b[1] - a[1]));
  // const years = [...new Set(posts.map(post => format(new Date(post.date), "yyyy")))];

  const filteredReadings = readings
    .filter(post => selectedTag === "All" || post.tags.includes(selectedTag))
    .filter(post => selectedYear === "" || format(new Date(post.date), "yyyy") === selectedYear);

  const convertDate = (date: string): string => {
    return format(new Date(date), "LLL/dd")
  }

  // mark the first post of each year, for display the year interval.
  let currYear = "";
  const yearIntervalIndex: Record<string, number> = {};
  filteredReadings.forEach((post, index) => {
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
      <div id="tags" className="subsection pt-8 flex flex-wrap gap-2">
        {Object.entries(sortedTags).map(([tag, count], index) => {
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
              {tag}<sup>{count}</sup>
            </Badge>
          );
        })}
      </div>
      <div id="posts" className="subsection pt-8 flex flex-col items-between">
        {filteredReadings.map((post, index) => {
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
                href={`/reading/${post._meta.path}`}
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
    </>
  )
}


export const ReadingsSectionSkeleton = () => {
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