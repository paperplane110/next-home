"use client";

import { useFrame } from "./frame-context";

export function Frame() {
  const { isShowFrame } = useFrame();

  if (!isShowFrame) return null;

  return (
    <div className="sticky -z-10 top-0">
      <div className="absolute border-b border-gray-300
       border-dashed w-screen h-18 text-gray-300 pr-2 flex justify-end items-end">h-18</div>
      <div className="absolute border-b border-gray-300 border-dashed w-screen h-[calc(50vh-50%)] text-gray-300 pr-2 flex justify-end items-end">mid</div>
      <div className="absolute border-r border-gray-300 border-dashed h-screen translate translate-x-[50vw] w-px text-gray-300"></div>
      <div className="absolute translateborder-gray-300 translate-x-[calc(50vw-3.5rem)] w-px text-gray-300">center</div>
      <div className="absolute border-x border-gray-300 border-dashed h-screen w-full sm:w-[640px] pt-18 text-right translate translate-x-[calc(50vw-50%)] text-gray-300 pr-2">
        <p className="text-gray-300">sm<br/>640px</p>
        <p className="text-sm">sm text</p>
        <p className="text-base">base text</p>
        <p className="text-lg">lg text</p>
        <p className="text-xl">xl text</p>
        <p className="text-2xl">2xl text</p>
        <p className="text-3xl">3xl text</p>
        <p className="text-4xl">4xl text</p>
        <p className="text-5xl">5xl text</p>
        <p className="text-6xl">6xl text</p>
        <p className="text-7xl">7xl text</p>
        <div className="text-left">
          <p className="text-xs">xs 字体</p>
          <p className="text-sm">sm 字体</p>
          <p className="text-base">base 字体</p>
          <p className="text-lg">lg 字体</p>
          <p className="text-xl">xl 字体</p>
          <p className="text-2xl">2xl 字体</p>
          <p className="text-3xl">3xl 字体</p>
          <p className="text-4xl">4xl 字体</p>
          <p className="text-5xl">5xl 字体</p>
          <p className="text-6xl">6xl 字体</p>
          <p className="text-7xl">7xl 字体</p>
        </div>
      </div>
      <div className="absolute border-x border-gray-300 border-dashed h-screen hidden md:block w-[768px] pt-18 text-right translate translate-x-[calc(50vw-50%)] text-gray-300 pr-2">md<br/>768px</div>
      <div className="absolute border-x border-gray-300 border-dashed h-screen hidden lg:block w-[1024px] pt-18 text-right translate translate-x-[calc(50vw-50%)] text-gray-300 pr-2">lg<br/>1024px</div>
      <div className="absolute border-x border-gray-300 border-dashed h-screen hidden xl:block w-[1280px] pt-18 text-right translate translate-x-[calc(50vw-50%)] text-gray-300 pr-2">xl<br/>1280px</div>
      <div className="absolute border-t border-gray-300 border-dashed w-screen h-16 text-gray-300 pr-2 flex justify-end items-start translate translate-y-[calc(100vh-64px)]">h-16</div>
    </div>
  );
}