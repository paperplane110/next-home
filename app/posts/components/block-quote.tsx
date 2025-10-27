export const BlockQuote = ({ children }: { children: React.ReactNode }) => {
  return (
    <blockquote className="relative bg-muted/70 px-6 py-2 my-4 text-accent-foreground rounded-md">
      <span className="absolute -top-4 -left-2 inline-block text-7xl font-serif text-muted-foreground/70 select-none">“</span>
      {children}
    </blockquote>
  )
}