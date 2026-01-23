"use client"
import { ReactNode } from 'react';
import { authClient } from "@/feature/auth/client";
import AccessDenied from "@/components/access-denied";
import { LoaderIcon } from 'lucide-react';



export default function SecretBaseLayout({ children }: { children: ReactNode }) {
  const { data } = authClient.useSession();
  if (!data) {
    return (
      <div className="section page-margin-top flex-1 flex justify-center items-center">
        <h1 className="text-2xl font-semi font-pixel mb-4">Authenticating</h1>
        <LoaderIcon className="animate-spin" size={24}/>
      </div>
    )
  } else if (data.user.name !== "Tianyu Yuan") {
    return (
      <AccessDenied />
    )
  }
  return (
    <>
      {children}
    </>
  )
}