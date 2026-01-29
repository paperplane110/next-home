import { cn } from "@/lib/utils";
import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";

export default function OuterLink({
  href,
  children,
  className
}: React.ComponentProps<"a">) {
  const isInternal = href?.startsWith("/") || true;
  const target = isInternal ? "_self" : "_blank";
  return (
    <Link
      href={href || "#"}
      target={target}
      rel="noopener noreferrer"
      className={cn("hover:text-muted-foreground hover:underline", className)}
    >
      {children}<ArrowUpRightIcon width={12} className="inline text-primary -mt-3 ml-0.5" />
    </Link>
  )
}