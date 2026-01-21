"use client"
import Image from "next/image";
import { useState } from "react";
import { ChevronsDownUpIcon, ChevronsUpDownIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

type PositionContentType = "h3" | "bullet"

export type WorkExperienceProps = {
  company: string;
  logo: string;
  isCurrent: boolean;
  positions: {
    isCollapsed?: boolean;
    icon?: string;
    title: string;
    start: string;
    end?: string;
    type: string;
    content: {
      type: PositionContentType;
      text: string[];
    }[];
    skills: string[];
  }[];
}

type PositionProps = {
  position: WorkExperienceProps["positions"][0];
  isFirst: boolean;
  isLast: boolean;
}


const PositionItem = ({ position, isFirst, isLast }: PositionProps) => {
  const [isOpen, setIsOpen] = useState(!position.isCollapsed);
  return (
    <div id="exp" className="flex gap-1">
      <div id="icon-sideline" className="flex flex-col items-center">
        <div id="vertical-line" className={cn("h-2 md:h-3 w-px bg-gray-200", isFirst && "bg-transparent")} />
        <div id="icon" className="flex items-center justify-center size-6 rounded-md border bg-transparent">
          <div className="flex items-center justify-center size-5  rounded-sm">
            <span className={`${position.icon ? position.icon : "icon-[lucide--code-xml]"} size-4 text-gray-500`} />
          </div>
        </div>
        <div id="vertical-line" className={cn("flex-1 w-px bg-gray-200", isLast && "hidden")} />
      </div>
      <Collapsible
        id="exp-content"
        open={isOpen}
        onOpenChange={setIsOpen}
        className="flex-1"
      >
        <CollapsibleTrigger asChild>
          <div className={cn(
            "w-full flex justify-between items-center py-2 px-3 rounded-md cursor-pointer",
            "transition-colors ease-in-out hover:bg-muted/70"
          )}>
            <div id="exp-brief-content">
              <div id="exp-brief-title" className="text-start font-semibold">
                {position.title}
              </div>
              <div id="exp-period" className="flex md:hidden items-center mt-1 gap-2 text-muted-foreground text-sm">
                {position.type}
                <div className="h-4">
                  <Separator orientation="vertical" />
                </div>
                {position.start} - {position.end ? position.end : "Present"}
              </div>
            </div>
            <div id="exp-brief-right" className="flex items-center gap-4">
              <div id="exp-period" className="hidden md:flex items-center mt-1 gap-2 text-muted-foreground text-sm">
                {position.type}
                <div className="h-4">
                  <Separator orientation="vertical" />
                </div>
                {position.start} - {position.end ? position.end : "Present"}
              </div>
              <Button size="icon-sm" variant="link" className="relative">
                <ChevronsUpDownIcon
                  size={16}
                  className={cn(
                    "absolute transition-opacity duration-200",
                    isOpen ? "opacity-0" : "opacity-100"
                  )}
                />
                <ChevronsDownUpIcon
                  size={16}
                  className={cn(
                    "absolute transition-opacity duration-200",
                    isOpen ? "opacity-100" : "opacity-0"
                  )}
                />
              </Button>
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent
          className={cn(
            "overflow-hidden relative px-3 transition-all ease-out",
            "data-[state=closed]:animate-collapsible-up duration-200",
            "data-[state=open]:animate-collapsible-down duration-200",
          )}
        >
          {/* <div className="absolute top-4 left-0 h-full border-l-2 border-l-primary">
          </div> */}
          {position.content.map((contentItem, index) => {
            if (contentItem.type === "bullet") {
              return (
                <ul
                  key={index}
                  id="exp-bullets"
                  className="list-disc list-inside pl-1 text-sm leading-6 my-2 marker:text-gray-300"
                >
                  {contentItem.text.map((bullet, bulletIndex) => (
                    <li key={bulletIndex}>{bullet}</li>
                  ))}
                </ul>
              );
            } else if (contentItem.type === "h3") {
              return (
                <h3
                  key={index}
                  className="text-sm text-muted-foreground fade-in mt-2"
                >
                  {contentItem.text.join(" ")}
                </h3>
              );
            } else {
              return null;
            }
          })}
        </CollapsibleContent>
        <div id="skill-tag-list" className="mt-2 mb-4 pl-3 flex flex-wrap gap-x-1 gap-y-2">
          {position.skills.map((skill, index) => (
            <Badge
              key={index}
              className="bg-muted rounded-sm text-muted-foreground"
              variant="outline">
              {skill}
            </Badge>
          ))}
        </div>
      </Collapsible>
    </div>
  )
}

export const WorkExperience = ({ career }: { career: WorkExperienceProps }) => {
  return (
    <div id="work-experience" className="py-4">
      <div id="company" className="flex items-center gap-4 mb-1">
        <div id="company-logo" className="size-6 flex items-center justify-center">
          {career.logo.startsWith("icon")
            ? (
              <span className={`block size-4 bg-[#2529d8] ${career.logo}`} />
            )
            : career.logo.startsWith("/")
              ? (
                <Image
                  src={career.logo}
                  alt={career.company}
                  width={16}
                  height={16}
                />
              )
              : (
                <span className="text-sm font-light">{career.logo}</span>
              )
          }
        </div>
        <div id="company-name" className="text-xl font-serif soft-70 font-light">
          {career.company}
        </div>
        {career.isCurrent && (
          <div id="company-indicator" className="flex items-center">
            <span className="inline-block w-[5px] h-[5px] rounded-full bg-primary dot-breath"></span>
          </div>
        )}
      </div>
      {career.positions.map((position, index) => (
        <div key={index} className="">
          <PositionItem
            position={position}
            isFirst={index === 0}
            isLast={index === career.positions.length - 1}
          />
        </div>
      ))}
    </div>
  )
}
