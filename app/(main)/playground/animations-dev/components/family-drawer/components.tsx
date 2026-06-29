import {
  BannedIcon,
  DangerIcon,
  FaceIDIcon,
  LockIcon,
  PassIcon,
  PhraseIcon,
  RecoveryPhraseIcon,
  ShieldIcon,
  WarningIcon,
} from "./icons";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

export function Button({
  children, onClick
}: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      data-vaul-no-drag=""
      className="focus-visible:shadow-focus-ring-button flex h-12 w-full items-center gap-[15px] rounded-[16px] bg-[#F7F8F9] px-4 text-[17px] font-semibold text-[#222222] transition-transform focus:scale-95 active:scale-95 md:font-medium"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ children, onClick, className }:
  { children: React.ReactNode; onClick: () => void; className?: string }
) {
  return (
    <button
      data-vaul-no-drag=""
      className={cn(
        "focus-visible:shadow-focus-ring-button flex h-12 w-full items-center justify-center gap-[15px] rounded-full text-center text-[19px] font-semibold transition-transform focus:scale-95 active:scale-95 md:font-medium",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function Header({ icon, title, description }:
  {
    icon: React.ReactNode;
    title: string;
    description: string;
  }
) {
  return (
    <header className="mt-[21px]">
      {icon}
      <h2 className="mt-2.5 text-[22px] font-semibold text-[#222222] md:font-medium">
        {title}
      </h2>

      <p className="mt-3 text-[17px] leading-[24px] font-medium text-[#999999] md:font-normal">
        {description}
      </p>
    </header>
  );
}

type ViewOptions = "default" | "key" | "phrase" | "remove";


export function DefaultView({ setView }: { setView: (view: ViewOptions) => void }) {
  return (
    <>
      <header className="mb-4 flex h-[72px] items-center border-b border-[#F7F7F7] pl-2">
        <h2 className="text-[19px] font-semibold text-[#222222] md:font-medium">
          Options
        </h2>
      </header>
      <div className="space-y-3">
        <Button
          onClick={() => {
            setView("key");
          }}
        >
          <LockIcon />
          View Private Key
        </Button>
        <Button
          onClick={() => {
            setView("phrase");
          }}
        >
          <PhraseIcon />
          View Recovery Phase
        </Button>
        <button
          className="focus-visible:shadow-focus-ring-button flex h-12 w-full items-center gap-[15px] rounded-[16px] bg-[#FFF0F0] px-4 text-[17px] font-semibold text-[#FF3F40] transition-transform focus:scale-95 active:scale-95 md:font-medium"
          onClick={() => {
            setView("remove");
          }}
        >
          <WarningIcon />
          Remove Wallet
        </button>
      </div>
    </>
  );
}

export function KeyView({ setView }: { setView: (view: ViewOptions) => void }) {
  return (
    <>
      <Header
        icon={<RecoveryPhraseIcon />}
        title="Private Key"
        description="Your Private Key is the key used to back up your wallet. Keep it
			  secret and secure at all times."
      />
      <ul className="mt-6 space-y-4 border-t border-[#F5F5F5] pt-6">
        <li className="flex items-center gap-3 text-[15px] font-semibold text-[#999999] md:font-medium">
          <ShieldIcon />
          Keep your private key safe
        </li>
        <li className="flex items-center gap-3 text-[15px] font-semibold text-[#999999] md:font-medium">
          <PassIcon />
          Don’t share it with anyone else
        </li>
        <li className="flex items-center gap-3 text-[15px] font-semibold text-[#999999] md:font-medium">
          <BannedIcon />
          If you lose it, we can’t recover it
        </li>
      </ul>
      <div className="mt-7 flex gap-4">
        <SecondaryButton
          onClick={() => setView("default")}
          className="bg-[#F0F2F4] text-[#222222]"
        >
          Cancel
        </SecondaryButton>
        <SecondaryButton
          onClick={() => setView("default")}
          className="bg-[#4DAFFF] text-[#FFFFFF]"
        >
          <FaceIDIcon />
          Reveal
        </SecondaryButton>
      </div>
    </>
  );
}