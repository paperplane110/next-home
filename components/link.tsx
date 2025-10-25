import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";

export default function OuterLink({ href, children }: { href: string, children: React.ReactNode }) {
  const isInternal = href.startsWith("/");
  const target = isInternal ? "_self" : "_blank";
  return (
    <Link 
        href={href} 
        target={target} 
        rel="noopener noreferrer" 
        className="inline-flex text-primary hover:text-muted-foreground"
    >
      {children}
      <ArrowUpRightIcon width={12} className="text-pink-600 -mt-1 -mr-0.5" />
    </Link>
  )
}