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
                "w-40 h-30 rounded-2xl bg-linear-to-b from-black/70 to-black/80 shadow-[0_12px_20px_rgba(0,0,0,0.35)]",
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
                "w-40 h-30 rounded-2xl bg-linear-to-b from-blue-400/70 to-blue-400 shadow-[0_12px_20px_rgba(0,0,0,0.35)]",
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
      <div className="subsection mt-16">
        <h2 className="font-bold">实现思路</h2>
        <div className="text-muted-foreground">
          <p className="mt-8 text-black ">
            主要有三个层次：folder-back, files, folder-cover：
          </p>
          <p className="mt-4 leading-loose">
            1) folder-back 是文件夹的背景，使用 <code>shadow, translate-z-[10px]</code>来实现悬浮的效果。
            然后背景颜色使用 <code>bg-linear-to-b from-blue-400/70 to-blue-400</code>增添一种更加细腻的变化。
          </p>
          <p className="mt-4 leading-loose">
            2) folder-cover 是文件夹的封面，毛玻璃质感通过 <code>backdrop-blur-[1px]</code> 实现。
            同时，为了保持文件夹的立体感，folder-cover 也使用了 <code>transform-3d -rotate-x-20</code> 来实现旋转。
          </p>
          <p className="mt-4 leading-loose">
            3) files 是文件夹中的文件，它们的位置通过 <code>transform-3d translate-*</code> 来实现。
            具体来说，每个文件都有一个固定的位置，当文件夹打开时，文件会从原来的位置移动到新的位置。
          </p>
          <p className="mt-4 text-black">
            然后就是动画效果的实现，分为两个状态：hover 状态和 open 状态：
          </p>
          <p className="mt-4 leading-loose">
            1) hover 状态需要注意的就是使用 <code>group-hover</code> 来检测整个文件夹是否被 hover 到。
            为了让用户感受到反应灵敏，动画曲线使用了 <code>ease-out</code>。
          </p>
          <p className="mt-4 leading-loose">
            2) open 状态的实现需要解决两个问题：a) 点击文件夹区域时激活、点击文件夹之外的区域时关闭；b) 以及实现文件的移动动画。
          </p>
          <p className="mt-4 leading-loose">
            2.a) 点击文件夹区域时激活、点击文件夹之外的区域时关闭。需要获取文件夹的<code>ref</code>，
            同时订阅<code>document</code>的点击事件，判断点击是否在文件夹区域内。
            若在其内<code>ref.current.contains(event.target)</code>，则激活文件夹；
            否则关闭文件夹。
          </p>
          <p className="mt-4 leading-loose">
            2.b) 实现文件的移动动画。需要使用 <code>translate-* rotate-*</code> 来实现文件的移动。
            为了让动画更加平滑，延长了动画时间为 500ms，曲线使用了 <code>ease-in-out</code>。
            但是样式的改变，通过属性样式 <code>data-[state=open]:...</code> 来将样式赋予元素。
          </p>
          <p className="mt-4 text-black">
            更多的细节：
          </p>
          <p className="mt-4 leading-loose">
            1）hover 时，让文件夹在 z 轴上更加靠近用户，增加立体感。
          </p>
          <p className="mt-4 leading-loose">
            2）open 时，通过给 file 添加 <code>hover:data-[state=open]:...</code> 进一步增加交互性。
            当文件夹打开时，用户将鼠标悬浮在 file 上时，file 微微上移，类似打牌的效果。
          </p>
          <p className="mt-4 leading-loose">
            3）若 transform 时，各个组件上文字、图案变化产生了延迟抖动，
            则给最外层父组件添加 <code>will-change-transform</code> 来优化性能。
          </p>
        </div>
      </div>
    </div>
  );
}
