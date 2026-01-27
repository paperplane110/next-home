"use client"

import { useState } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { allReadings } from "content-collections";
import { format } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { ArticleTag } from "@/components/article-tag";
import { Book } from "@/components/book/book";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Grid2X2, List, Undo2 } from "lucide-react";

enum LayoutType {
  List = "list",
  Grid = "grid",
}

export const ReadingsSection = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const defaultTag = searchParams.get("tag") || "All";
  const defaultYear = searchParams.get("year") || "";

  const [selectedTag, setSelectedTag] = useState(defaultTag);
  const [selectedYear, setSelectedYear] = useState(defaultYear);
  const [layout, setLayout] = useState(LayoutType.List)

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
      <div id="tags" className="subsection pt-8 flex flex-wrap items-center gap-2">
        <ArticleTag
          tag="All"
          count={readings.length}
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
        <div className="h-4">
          <Separator orientation="vertical" />
        </div>
        <Badge
          variant={layout !== LayoutType.List ? "secondary" : "default"}
          onClick={() => setLayout(LayoutType.List)}
        >
          <List size={32} />
        </Badge>
        <Badge
          variant={layout !== LayoutType.Grid ? "secondary" : "default"}
          onClick={() => setLayout(LayoutType.Grid)}
        >
          <Grid2X2 size={32} />
        </Badge>
      </div>
      {layout === LayoutType.List && (
        <div id="readings-list" className="subsection pt-8 flex flex-col items-between">
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
                    <div
                      className={cn(
                        "cursor-pointer hover:text-pink-600",
                        selectedYear === year && "text-pink-600"
                      )}
                      onClick={() => handleFilter(undefined, year)}
                    >
                      {year}
                    </div>

                    {selectedYear !== "" && (
                      <div className="flex items-center gap-1 cursor-pointer hover:text-pink-600" onClick={() => handleFilter(undefined, "")}>
                        <Undo2 className="-translate-y-px" size={12} />
                        Back
                      </div>
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
      )}


      {layout === LayoutType.Grid && (
        <div id="books" className="subsection pt-8 grid grid-cols-2 sm:grid-cols-3">
          {filteredReadings.map((reading, index) => {
            const year = format(new Date(reading.date), "yyyy");
            return (
              <>
                {index === yearIntervalIndex[year] && (
                  <div
                    id={`year-${year}`}
                    className={cn(
                      "flex justify-between pt-10 mb-8 text-xs font-mono text-muted-foreground border-b",
                      "col-span-2 sm:col-span-3",
                      index !== 0 && "mt-4"
                    )}
                  >
                    <p className={cn("cursor-pointer hover:text-pink-600", selectedYear === year && "text-pink-600")} onClick={() => handleFilter(undefined, year)}>{year}</p>
                    {selectedYear !== "" && (
                      <div className="cursor-pointer hover:text-pink-600" onClick={() => handleFilter(undefined, "")}> Back</div>
                    )}
                  </div>
                )}
                <Book
                  coverColor={reading.book.coverColor}
                  backColor={reading.book.backColor}
                  href={`/reading/${reading._meta.path}`}
                  titleTextColor={reading.book.titleTextColor}
                  pageNumber={reading.book.pageNumber}
                  bookMarginRight={reading.book.bookMarginRight}
                  bookBindWidth={6}
                >
                  <div className="py-2 font-serif">{reading.book.name}</div>
                </Book>
              </>
            );
          })}
        </div>
      )}
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