import { AuthView } from '@neondatabase/auth/react';
import AccessDeniedCard from '@/components/access-denied-card';
import { neonAuth } from "@neondatabase/auth/next/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamicParams = false;
export default async function AuthPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ path: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { path } = await params;
  if (path === "sign-up") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <h1 className="text-3xl font-semibold font-pixel">Access Denied</h1>
        <div className="my-4 font-pixel text-muted-foreground">
          Please <Link className="underline" href="/auth/sign-in?redirectTo=/auth/sign-up">login</Link> or contact the <Link className="underline" href="mailto:jyuan7155@gmail.com">lab admin</Link> for access.
        </div>
        <AccessDeniedCard />
      </div>
    )
  }

  if (path === "sign-in") {
    const auth = await neonAuth();
    const searchParamsObj = await searchParams;
    const redirectTo = searchParamsObj.redirectTo as string | undefined;

    if (auth?.user) {
      return redirect(redirectTo || '/');
    }
  }

  return (
    <main className="container h-full mx-auto flex grow flex-col items-center justify-center gap-3 self-center p-4 md:p-6">
      <AuthView path={path} />
    </main>
  );
}

