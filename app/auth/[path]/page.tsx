import { AuthView } from '@neondatabase/auth/react';
import AccessDenied from '@/components/access-denied';
export const dynamicParams = false;
export default async function AuthPage({ params }: { params: Promise<{ path: string }> }) {
  const { path } = await params;
  if (path === "sign-up") {
    return (
      <AccessDenied />
    )
  }
  return (
    <main className="container h-full mx-auto flex grow flex-col items-center justify-center gap-3 self-center p-4 md:p-6">
      <AuthView path={path} />
    </main>
  );
}

