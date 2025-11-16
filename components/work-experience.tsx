"use client"
import { useState } from "react";
import { ChevronDown, ChevronsDownUpIcon, ChevronsUpDownIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

type WorkExperienceProps = {
  company: string;
  logo: string;
  isCurrent: boolean;
  positions: {
    isCollapsed?: boolean;
    title: string;
    start: string;
    end?: string;
    type: string;
    content: {
      type: string;
      text: string[];
    }[];
    skills: string[];
  }[];
}
type PositionProps = WorkExperienceProps["positions"][0];


const PositionItem = ({ position }: { position: PositionProps }) => {
  const [isOpen, setIsOpen] = useState(!position.isCollapsed);
  return (
    <div id="exp" className="flex gap-2 mt-2 ml-2">
      {/* <div id="icon-sideline" className="pt-2 flex flex-col items-center">
                <div id="icon" className="flex items-center justify-center rounded-md size-6 bg-accent">
                    <Code size={14} />
                </div>
                <div id="vertical-line" />
            </div> */}
      <Collapsible
        id="exp-content"
        open={isOpen}
        onOpenChange={setIsOpen}
        className="flex-1"
      >
        <CollapsibleTrigger asChild>
          <div className={cn(
            "w-full flex justify-between items-center py-2 px-4 border-l border-gray-200 rounded-r-md ",
            "transition-colors ease-in-out hover:bg-muted"
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
            "overflow-hidden relative px-4 transition-all duration-250 ease-out",
            "data-[state=closed]:animate-collapsible-up",
            "data-[state=open]:animate-collapsible-down",
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
                  className="list-disc list-inside pl-2 text-base leading-7 my-2"
                >
                  {contentItem.text.map((bullet, bulletIndex) => (
                    <li key={bulletIndex}>{bullet}</li>
                  ))}
                </ul>
              );
            } else if (contentItem.type === "text") {
              return (
                <p
                  key={index}
                  className="text-base font-semibold fade-in mt-2"
                >
                  {contentItem.text.join(" ")}
                </p>
              );
            } else {
              return null;
            }
          })}
          <div id="skill-tag-list" className="mt-4 flex gap-x-1">
            {position.skills.map((skill, index) => (
              <Badge
                key={index}
                variant="outline">
                {skill}
              </Badge>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

export const WorkExperience = ({ career }: { career: WorkExperienceProps }) => {
  return (
    <div id="work-experience" className="py-4">
      <div id="company" className="flex items-center gap-3">
        <div id="company-logo">
          <span className={`block size-4 bg-[#2529d8] ${career.logo}`}></span>
        </div>
        <div id="company-name" className="text-xl font-light">
          {career.company}
        </div>
        {career.isCurrent && (
          <div id="company-indicator" className="flex items-center">
            <span className="inline-block w-[5px] h-[5px] rounded-full bg-primary dot-breath"></span>
          </div>
        )}
      </div>
      {career.positions.map((position, index) => (
        <PositionItem key={index} position={position} />
      ))}
    </div>
  )
}
