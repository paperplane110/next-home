import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navigation />
      <div className="min-h-[calc(100vh-8rem)] pt-18 flex flex-col">
        {children}
      </div>
      <Footer />
    </>
  );
}
