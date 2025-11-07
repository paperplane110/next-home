import { cn } from "@/lib/utils";

export const Tips = ({ children, title }: {
  children: React.ReactNode,
  title?: string,
}) => {
  return (
    <div className={cn(
      "relative bg-[#f0f9eb] text-[#0f5132] px-4 pt-4 pb-4 my-2 rounded-md",
      title && "pt-2"
    )}>
      {title && <p className="font-bold">{title}</p>}
      {children}
    </div>
  );
}