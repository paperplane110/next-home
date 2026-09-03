import OuterLink from "@/components/link";

type Props = React.ComponentProps<"a"> & {
  children: React.ReactNode;
  href: string;
};

export const A = ({ children, href, className }: Props) => {
  return (
    <OuterLink href={href} className={className}>
      <span className="underline">{children}</span>
    </OuterLink>
  );
};
