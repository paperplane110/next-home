"use client"
import { cn } from "@/lib/utils";
import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { useClickInsideOutside } from "@/hooks/use-click-inside-outside";

export default function FolderComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const folderRef = useRef<HTMLDivElement>(null);
  const handleClickOutside = useCallback(() => setIsOpen(false), []);
  const handleToggle = () => setIsOpen(!isOpen);
  useClickInsideOutside(folderRef, handleToggle, handleClickOutside);
  const dataState = isOpen ? "open" : "off";

  const [isImgOpen, setIsImgOpen] = useState(false);
  const imgFolderRef = useRef<HTMLImageElement>(null);
  useClickInsideOutside(
    imgFolderRef, 
    () => setIsImgOpen(!isImgOpen), 
    useCallback(() => setIsImgOpen(false), [])
  );
  const imgDataState = isImgOpen ? "open" : "off";

  return (
    <div className="page-top-margin sm:pb-8 section">
      <header className="subsection">
        <h1 className="headline font-serif font-light soft-70">Folder Component</h1>
        <p className="mt-8 text-sm font-medium text-muted-foreground">
          简洁、细腻的拟物文件夹组件，点击文件夹可以展开文件内容。
        </p>

      </header>

      <div className="subsection mt-16">
        <h2 className="font-bold">Original version</h2>
        <div id="container" className="mt-8 h-100 w-full border border-dashed border-gray-300 rounded-4xl flex items-center justify-center">

          {/* 文件夹主体 */}
          <div ref={folderRef} id="folder" className="group cursor-pointer relative flex items-center justify-center perspective-normal">
            <div
              id="folder-back"
              className={cn(
                "w-40 h-30 rounded-2xl bg-black/70 shadow-[0_12px_20px_rgba(0,0,0,0.35)]",
                "transition-all duration-300 ease-out group-hover:translate-z-[5px]",
                "data-[state=open]:translate-z-[5px]"
              )}
              data-state={dataState}
            >
            </div>

            <div id="file-back"
              className={cn(
                "absolute w-32 h-27 p-2 bg-white -translate-y-3 border rounded-md",
                "transform-3d rotate-2",
                "transition-transform duration-300 ease-out",
                "group-hover:translate-y-[-40px] group-hover:translate-x-[5px] group-hover:rotate-6",
                "data-[state=open]:delay-100",
                "data-[state=open]:duration-500",
                "data-[state=open]:ease-in-out",
                "data-[state=open]:translate-y-[-90px]",
                "data-[state=open]:translate-x-[-90px]",
                "data-[state=open]:-rotate-15",
                "hover:data-[state=open]:duration-300",
                "hover:data-[state=open]:translate-y-[-100px]",
                "hover:data-[state=open]:translate-x-[-95px]"
              )}
              data-state={dataState}
            >
              <div id="file-line" className="w-12 h-2 bg-gray-100 rounded-sm"></div>
              <div id="file-img" className="mt-2 w-16 h-8 rounded-sm bg-gray-100"></div>
              <div id="file-line" className="mt-2 w-24 h-2 bg-gray-100 rounded-sm"></div>
              <div id="file-line" className="mt-2 w-24 h-2 bg-gray-100 rounded-sm"></div>
            </div>

            <div id="file-middle"
              className={cn(
                "absolute w-32 h-27 p-2 bg-white -translate-y-3 border rounded-md",
                "transform-3d rotate-0",
                "transition-transform duration-300 ease-out",
                "group-hover:translate-y-[-35px]",
                "data-[state=open]:delay-50",
                "data-[state=open]:duration-500",
                "data-[state=open]:ease-in-out",
                "data-[state=open]:translate-y-[-105px]",
                "data-[state=open]:rotate-0",
                "hover:data-[state=open]:duration-300",
                "hover:data-[state=open]:translate-y-[-115px]",
              )}
              data-state={dataState}
            >
              <div className="flex items-center gap-2">
                <div id="file-avatar" className="size-8 rounded-full bg-gray-100"></div>
                <div>
                  <div id="file-line" className="w-8 h-2 bg-gray-100 rounded-sm"></div>
                  <div id="file-line" className="mt-1 w-12 h-2 bg-gray-100 rounded-sm"></div>
                </div>
              </div>
              <div id="file-line" className="mt-4 w-24 h-2 bg-gray-100 rounded-sm"></div>
              <div id="file-line" className="mt-2 w-24 h-2 bg-gray-100 rounded-sm"></div>
            </div>

            <div
              className={cn(
                "absolute w-32 h-27 p-2 bg-white -translate-y-3 border rounded-md",
                "transform-3d -rotate-2",
                "transition-transform duration-300 ease-out",
                "group-hover:translate-y-[-30px] group-hover:translate-x-[-5px] group-hover:-rotate-6",
                "data-[state=open]:duration-500",
                "data-[state=open]:ease-in-out",
                "data-[state=open]:translate-y-[-95px]",
                "data-[state=open]:translate-x-[90px]",
                "data-[state=open]:rotate-15",
                "hover:data-[state=open]:duration-300",
                "hover:data-[state=open]:translate-y-[-105px]",
                "hover:data-[state=open]:translate-x-[95px]"
              )}
              data-state={dataState}
            >
              <div id="file-line" className="w-12 h-2 bg-gray-100 rounded-sm"></div>
              <div id="file-img" className="mt-2 w-16 h-8 rounded-sm bg-gray-100"></div>
              <div id="file-line" className="mt-2 w-24 h-2 bg-gray-100 rounded-sm"></div>
              <div id="file-line" className="mt-2 w-24 h-2 bg-gray-100 rounded-sm"></div>
            </div>

            <div id="folder-cover"
              data-state={dataState}
              className={cn(
                "absolute w-40 h-25 rounded-2xl bg-black/30 border border-black/10 backdrop-blur-[1px] transform-3d -rotate-x-20 translate-y-[10px]",
                "transition-transform duration-300 ease-out origin-bottom group-hover:-rotate-x-32",
                "data-[state=open]:-rotate-x-55"
              )}>
            </div>
          </div>
        </div>
      </div>
      <div className="subsection mt-16">
        <h2 className="font-bold">Photos folder</h2>
        <div id="container" className="mt-8 h-100 w-full border border-dashed border-gray-300 rounded-4xl flex items-center justify-center">

          {/* 文件夹主体 */}
          <div ref={imgFolderRef} id="folder" className="group cursor-pointer relative flex items-center justify-center perspective-normal">
            <div
              id="folder-back"
              className={cn(
                "w-40 h-30 rounded-2xl bg-blue-400/70 shadow-[0_12px_20px_rgba(0,0,0,0.35)]",
                "flex items-center justify-center",
                "transition-all duration-300 ease-out group-hover:translate-z-[5px]",
                "data-[state=open]:translate-z-[5px]",
              )}
              data-state={imgDataState}
            >
              <ImageIcon className="w-16 h-16 drop-shadow-2xl text-blue-200/30" />
            </div>

            <div id="file-back"
              className={cn(
                "absolute w-32 h-27 bg-white -translate-y-3 rounded-md",
                "transform-3d rotate-2",
                "transition-transform duration-300 ease-out",
                "group-hover:translate-y-[-40px] group-hover:translate-x-[5px] group-hover:rotate-6",
                "data-[state=open]:delay-100",
                "data-[state=open]:duration-500",
                "data-[state=open]:ease-in-out",
                "data-[state=open]:translate-y-[-90px]",
                "data-[state=open]:translate-x-[-90px]",
                "data-[state=open]:-rotate-15",
                "hover:data-[state=open]:duration-300",
                "hover:data-[state=open]:translate-y-[-100px]",
                "hover:data-[state=open]:translate-x-[-95px]"
              )}
              data-state={imgDataState}
            >
              <Image src="/img/gallery/DSCF6105.jpg"
                width={640} height={480}
                className="w-full h-full object-cover rounded-md" alt="DSCF6105"
              />
            </div>

            <div id="file-middle"
              className={cn(
                "absolute w-32 h-27 bg-white -translate-y-3 rounded-md",
                "transform-3d rotate-0",
                "transition-transform duration-300 ease-out",
                "group-hover:translate-y-[-35px]",
                "data-[state=open]:delay-50",
                "data-[state=open]:duration-500",
                "data-[state=open]:ease-in-out",
                "data-[state=open]:translate-y-[-105px]",
                "data-[state=open]:rotate-0",
                "hover:data-[state=open]:duration-300",
                "hover:data-[state=open]:translate-y-[-115px]",
              )}
              data-state={imgDataState}
            >
              <Image src="/img/gallery/DSCF6470.jpg"
                width={640} height={480}
                className="w-full h-full object-cover rounded-md" alt="DSCF6470"
              />
            </div>

            <div
              className={cn(
                "absolute w-32 h-27 bg-white -translate-y-3 rounded-md",
                "transform-3d -rotate-2",
                "transition-transform duration-300 ease-out",
                "group-hover:translate-y-[-30px] group-hover:translate-x-[-5px] group-hover:-rotate-6",
                "data-[state=open]:duration-500",
                "data-[state=open]:ease-in-out",
                "data-[state=open]:translate-y-[-95px]",
                "data-[state=open]:translate-x-[90px]",
                "data-[state=open]:rotate-15",
                "hover:data-[state=open]:duration-300",
                "hover:data-[state=open]:translate-y-[-105px]",
                "hover:data-[state=open]:translate-x-[95px]"
              )}
              data-state={imgDataState}
            >
              <Image src="/img/gallery/hallstatt.jpeg"
                width={640} height={480}
                className="w-full h-full object-cover rounded-md" alt="hallstatt"
              />
            </div>

            <div id="folder-cover"
              data-state={imgDataState}
              className={cn(
                "absolute w-40 h-25 rounded-2xl bg-blue-400/30 border border-blue-400/10 backdrop-blur-[1px] transform-3d -rotate-x-20 translate-y-[10px]",
                "transition-transform duration-300 ease-out origin-bottom group-hover:-rotate-x-32 group-hover:translate-z-[5px]",
                "data-[state=open]:-rotate-x-55",
                "data-[state=open]:translate-z-[5px]",
              )}>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
