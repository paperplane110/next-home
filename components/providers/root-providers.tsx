"use client";

import { Agentation } from "agentation";
import { authClient } from "@/feature/auth/client";
import { NeonAuthUIProvider } from "@neondatabase/auth/react";
import { ReactLenis } from "lenis/react";
import { HydrateAtoms } from "@/components/providers/hydrate-atoms";
import { FrameProvider } from "@/components/providers/frame-context";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/sonner";
import PaperBg from "@/components/paper-bg";
import { PhotoUploadDialog } from "@/feature/photo/components/upload-dialog";
import { Frame } from "@/components/providers/frame";

interface RootProvidersProps {
  children: React.ReactNode;
  tagOptions: { label: string; value: string }[];
}

export function RootProviders({ children, tagOptions }: RootProvidersProps) {
  return (
    <>
      {process.env.NODE_ENV === "development" && <Agentation />}
      <HydrateAtoms tagOptions={tagOptions}>
        <NeonAuthUIProvider authClient={authClient}>
          <ReactLenis
            root
            options={{
              lerp: 0.1,
              duration: 1.2,
              smoothWheel: true,
            }}
          >
            <NuqsAdapter>
              <FrameProvider>
                <PhotoUploadDialog />
                <Frame />
                {children}
              </FrameProvider>
              <Toaster />
              <PaperBg />
              <Analytics />
            </NuqsAdapter>
          </ReactLenis>
        </NeonAuthUIProvider>
      </HydrateAtoms>
    </>
  );
}
