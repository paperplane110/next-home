import { cn } from "@/lib/utils";

export const Tips = ({ children, title }: {
  children: React.ReactNode,
  title?: string,
}) => {
  return (
    // NOTE MDXContent will pass string "undefined" to title
    // when there is no title prop.
    <div className={cn(
      "relative bg-[#f0f9eb] text-[#0f5132] px-4 pb-4 pt-2 my-2 rounded-md",
      title !== "undefined" && "pt-4"
    )}>
      {title && <p className="font-bold">{title}</p>}
      {children}
    </div>
  );
}