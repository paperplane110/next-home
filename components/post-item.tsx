import Link from "next/link"
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { allPosts } from "content-collections";

type Post = typeof allPosts[0];

interface PostItemProps {
  leadingURL: string;
  post: Post;
  disableTags?: boolean;
}

export const PostItem = ({ leadingURL, post, disableTags }: PostItemProps) => {
  // const years = [...new Set(posts.map(post => format(new Date(post.date), "yyyy")))];
  const convertDate = (date: string): string => {
    return format(new Date(date), "LLL/dd")
  }

  return (
    <Link
      href={`${leadingURL}/${post._meta.path}`}
      className="flex justify-between group py-1"
    >
      <div className="group-hover:underline decoration-primary">
        {post.title}
      </div>
      {/* <div className="flex-1 flex items-center px-4">
                    <div className="w-full h-[2px] group-hover:bg-muted-foreground/20"></div>
                  </div> */}
      <div className="flex items-center gap-2">
        {!disableTags && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => {
              return (
                <Badge key={index} variant="secondary" className="text-muted-foreground">
                  {tag}
                </Badge>
              );
            })}
          </div>
        )}
        <p className="text-xs font-mono text-muted-foreground group-hover:text-primary">
          {convertDate(post.date.toString())}
        </p>
      </div>
    </Link>
  )
}
