import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type ArticleTagProps = {
    tag: string;
    count?: number;
    isActivated: boolean;
    onClick: () => void
}

export const ArticleTag = ({ tag, count, isActivated, onClick }: ArticleTagProps) => {
  return (
    <Badge
      key={tag}
      variant={isActivated ? "default" : "secondary"}
      className={cn(
        "inline-block transition-none text-muted-foreground cursor-pointer",
        isActivated ? "text-white" : ""
      )}
      onClick={onClick}
    >
      {tag}
      {count && <sup>{count}</sup>}
    </Badge>
  )
}