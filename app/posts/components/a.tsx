import OuterLink from "@/components/link"

export const A = ({ children, href }: {
  children: React.ReactNode,
  href: string,
}) => {
  return (
    <OuterLink href={href}>
      <span className="underline">
        {children}
      </span>
    </OuterLink>
  );
}