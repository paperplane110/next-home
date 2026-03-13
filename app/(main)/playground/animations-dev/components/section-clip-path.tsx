"use client"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button";
import { BookOpenIcon, CircleUserIcon, ComponentIcon, HomeIcon, PenLineIcon, RefreshCwIcon, TrashIcon } from "lucide-react";
import { cn } from "@/lib/utils";


export function SectionClipPath() {
  return (
    <div className="subsection mt-32">
      <ClipPathIcon />
      <h2 className="font-bold text-2xl">
        Clip Path
      </h2>
      <p className="cp">
        <code>clip-path</code> 是用剪裁的方式元素形状的变化，比如图片、Tab、背景的遮罩和展示
      </p>
      <h3 className="font-bold mt-16">
        Drag to reveal
      </h3>
      <DragToReveal />
      <h3 className="font-bold mt-16">
        Image reveal animation
      </h3>
      <p className="cp">
        <code>clip-path</code> 可以用于图片初次展示的动画，点击按钮触发图片的展示动画
      </p>
      <ImageRevealAnimation />
      <p className="cp">
        对于只执行一次的动画，可以使用 <code>animation-fill-mode: forwards</code>，并且能够保持动画结束时的状态（即全部展现）。
      </p>
      <p className="cp">
        动画刷新的实现方法是，当点击刷新按钮时，改变动画元素的 <code>key</code>，从而触发该元素的重新渲染。
      </p>
      <p className="cp">
        还有一个细节，为了增添交互的感觉，为刷新按钮添加了一个旋转动画，使用相同的 cubic-bezier 曲线，实现慢-快-慢的旋转效果。
      </p>
      <h3 className="font-bold mt-16">
        Tabs transition
      </h3>
      <p className="cp">
        <code>clip-path</code> 可以用于实现丝滑的 Tab 切换的动画。
      </p>
      <TabsTransition />
      <p className="cp">
        主要思路是将一层绿色背景的相同 tab 区域覆盖在未激活的 tabs 上，我们称之为 <code>clip-path-container</code>，
        并且为其设置 <code>transition: clip-path 0.3s cubic-bezier(0.77, 0, 0.175, 1)</code>
      </p>
      <p className="cp">当点击 Tab 时，获取激活 Tab 的左右需要截取的范围，然后将截取的参数给到 <code>clip-path-container</code>。</p>
      <h3 className="font-bold mt-16">Homework: Hold to delete</h3>
      <p className="cp">
        实现一个删除按钮，当用户点击并按住按钮时，按钮逐渐变红，松开后按钮恢复正常。
      </p>
      <HoldToDelete />
    </div>
  )
}

function ClipPathIcon() {
  const [percentX, setPercentX] = useState(0);
  const updatePercentXFromClientX = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!e.currentTarget) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, e.clientX - rect.left);
    setPercentX(Math.min((x / rect.width) * 100, 100));
  }
  return (
    <div className="flex">
      <div className="relative font-bold text-2xl cursor-grab select-none font-mono"
        onMouseEnter={updatePercentXFromClientX}
        onMouseMove={updatePercentXFromClientX}
      >
        <div
          style={{
            clipPath: `inset(0 0 0 ${percentX}%)`
          }}
        >=======</div>
        <div className="absolute top-0 left-0"
          style={{
            clipPath: `inset(0 ${100 - percentX}% 0 0)`
          }}
        >&gt;&gt;&gt;&gt;&gt;&gt;&gt;</div>
        <div className="absolute top-[10%] h-[80%] w-4.5 bg-[#34d399]"
          style={{
            left: `${percentX}%`,
            clipPath: 'polygon(0% 15%, 50% 15%, 100% 50%, 50% 85%, 0 85%)'
          }}
        ></div>
      </div>
    </div>
  )
}

function DragToReveal() {
  const [dragX, setDragX] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateDragXFromClientX = (clientX: number) => {
    const containerEl = containerRef.current;
    if (!containerEl) return;
    const rect = containerEl.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = (x / rect.width) * 100;
    const clamped = Math.min(100, Math.max(0, percent));
    setDragX(clamped);
  }

  return (
    <div className="mt-8">
      <div ref={containerRef} className="relative w-full h-[250px] rounded-2xl overflow-hidden">
        <div className="w-full h-full absolute top-0 left-0"
          style={{
            clipPath: `inset(0 ${100 - dragX}% 0 0)`
          }}>
          <Image
            src="/img/playground/animation-dev/DSCF7295.jpg"
            alt="Zugspitze"
            width={1920}
            height={1080}
            className="w-full h-full object-cover" />
        </div>
        <div className="w-full h-full absolute top-0 left-0"
          style={{
            clipPath: `inset(0 0 0 ${dragX}%)`
          }}
        >
          <Image
            src="/img/playground/animation-dev/DSCF7295.jpg"
            alt="Zugspitze"
            width={1920}
            height={1080}
            className="w-full h-full object-cover grayscale-80" />
        </div>
        <div
          className="absolute top-0 h-full w-2 bg-white/30 hover:bg-white/50 cursor-ew-resize touch-none select-none"
          style={{
            left: `${dragX}%`
          }}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            updateDragXFromClientX(e.clientX)
          }}
          onPointerMove={(e) => {
            if (!e.currentTarget.hasPointerCapture(e.pointerId)) return
            updateDragXFromClientX(e.clientX)
          }}
          onPointerUp={(e) => {
            if (!e.currentTarget.hasPointerCapture(e.pointerId)) return
            e.currentTarget.releasePointerCapture(e.pointerId)
          }}
        >
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <div className="text-muted-foreground text-sm">Color picture</div>
          <div className="my-2 text-sm">
            <code>
              clip-path: inset(0 {(100 - dragX).toFixed(0)}% 0 0);
            </code>
          </div>
        </div>
        <div>
          <div className="text-muted-foreground text-sm">Grayscale picture</div>
          <div className="my-2 text-sm">
            <code>
              clip-path: inset(0 0 0 {dragX.toFixed(0)}%);
            </code>
          </div>
        </div>
      </div>
    </div>
  )
}

function ImageRevealAnimation() {
  const [revealKey, setRevealKey] = useState(0)

  return (
    <div className="mt-8">
      <div className="relative w-full h-[250px] rounded-2xl overflow-hidden">
        <div
          key={revealKey}
          className="w-full h-full absolute top-0 left-0"
          style={{
            clipPath: 'inset(0 0 100% 0)',
            animation: 'reveal 1s forwards cubic-bezier(0.77, 0, 0.175, 1)'
          }}
        >
          <Image
            src="/img/playground/animation-dev/DSCF7295.jpg"
            alt="Zugspitze"
            width={1920}
            height={1080}
            className="w-full h-full object-cover" />
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-4 right-4 bg-white/30 hover:bg-white/50 text-white hover:text-white"
          onClick={() => setRevealKey((k) => k + 1)}
        >
          <RefreshCwIcon
            key={revealKey}
            className="w-4 h-4"
            style={{
              animation: 'rotate 1s cubic-bezier(0.77, 0, 0.175, 1) forwards'
            }}
          />
        </Button>
        <style jsx>
          {`
          @keyframes reveal {
            to {
              clip-path: inset(0 0 0 0);
            }
          }
          @keyframes rotate {
            to {
              transform: rotate(360deg);
            }
          }
        `}
        </style>
      </div>
    </div>
  )
}

function TabsTransition() {
  const tabs = [
    { name: "Home", icon: <HomeIcon className="w-4 h-4 " /> },
    { name: "Writing", icon: <PenLineIcon className="w-4 h-4" /> },
    { name: "Reading", icon: <BookOpenIcon className="w-4 h-4" /> },
    { name: "About", icon: <CircleUserIcon className="w-4 h-4" /> },
    { name: "Playground", icon: <ComponentIcon className="w-4 h-4" /> },
  ]
  const [activeTab, setActiveTab] = useState(tabs[0].name)
  const [insetPercent, setInsetPercent] = useState([0, 0])
  const activeTabRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const containerEl = containerRef.current;
    const activeTabEl = activeTabRef.current;
    if (containerEl && activeTabEl) {
      const tabRect = activeTabEl.getBoundingClientRect()
      const containerRect = containerEl.getBoundingClientRect()
      const leftInsetPercent = activeTabEl.offsetLeft / containerRect.width * 100;
      const rightInsetPercent = (containerRect.width - tabRect.width - activeTabEl.offsetLeft) / containerRect.width * 100;
      setInsetPercent([leftInsetPercent, rightInsetPercent])
      containerEl.style.clipPath = `inset(0 ${rightInsetPercent}% 0 ${leftInsetPercent}% round 1rem)`
    }
  }, [activeTab, activeTabRef, containerRef])
  return (
    <div>
      <div className="mt-8 h-60 w-full bg-white border border-dashed border-gray-300 rounded-4xl flex flex-col items-center justify-center">
        <div className="relative">
          <div className="flex px-4 py-2 items-center justify-center">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                className="flex items-center gap-1 px-3 text-sm font-bold text-gray-600 hover:text-gray-900 cursor-pointer"
                onClick={() => setActiveTab(tab.name)}
              >
                {tab.icon} {tab.name}
              </button>
            ))}
          </div>
          <div
            ref={containerRef}
            className="absolute top-0 left-0 px-4 py-2 bg-emerald-500 flex items-center justify-center"
            style={{
              transition: "clip-path 0.3s cubic-bezier(0.77, 0, 0.175, 1)"
            }}
          >
            {tabs.map((tab) => (
              <button
                ref={tab.name === activeTab ? activeTabRef : null}
                key={tab.name}
                className="flex items-center gap-1 px-3 text-sm font-bold text-white cursor-pointer"
              >
                {tab.icon} {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 text-center">
        <code>clip-path: inset(0 {insetPercent[1].toFixed(2)}% 0 {insetPercent[0].toFixed(2)}% round 1rem);</code>
      </div>
    </div>
  )
}

function HoldToDelete() {
  const [holdProgress, setHoldProgress] = useState(0)
  const [isHold, setIsHold] = useState(false)
  const HOLD_THRESHOLD = 2000; // ms

  useEffect(() => {
    const holdInterval = setInterval(() => {
      if (isHold) {
        setHoldProgress((prev) =>
          Math.min(
            100,
            prev + 100 / HOLD_THRESHOLD * 100
          ))
      }
    }, 100)
    return () => {
      clearInterval(holdInterval)
    }
  }, [isHold])
  return (
    <div className="mt-8 py-16 w-full bg-white border border-dashed border-gray-300 rounded-4xl flex flex-col items-center justify-center gap-8">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2 items-center">
          <p className="text-muted-foreground text-xs">Layer 1: Not Activated</p>
          <button
            type="button"
            className="flex items-center active:scale-97 transition-transform px-6 py-2 bg-accent rounded-full cursor-pointer font-medium"
          >
            <TrashIcon className="w-4 h-4" />
            <span className="ml-2">Hold to delete</span>
          </button>
        </div>

        <div className="flex flex-col gap-2 items-center">
          <p className="text-muted-foreground text-xs">Layer 2: Activated</p>
          <button
            type="button"
            className="flex items-center px-6 py-2 bg-[#FFDBDC] rounded-full cursor-pointer font-medium text-[#E5484D] active:scale-97 transition-transform"
          >
            <TrashIcon className="w-4 h-4" />
            <span className="ml-2">Hold to delete</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2 items-center">
        <div className="relative active:scale-97 transition-transform duration-200 ease-[cubic-bezier(0.25, 0.46, 0.45, 0.94)]"
          onPointerDown={() => {
            setIsHold(true)
          }}
          onPointerUp={() => {
            setIsHold(false)
            setHoldProgress(0)
          }}
          onPointerLeave={() => {
            setIsHold(false)
            setHoldProgress(0)
          }}
        >
          <button
            type="button"
            className="flex items-center px-6 py-2 bg-accent rounded-full cursor-pointer font-medium"
          >
            <TrashIcon className="w-4 h-4" />
            <span className="ml-2">Hold to delete</span>
          </button>
          <button
            type="button"
            className={cn(
              "absolute top-0 right-0 flex items-center px-6 py-2 bg-[#FFDBDC] rounded-full cursor-pointer font-medium text-[#E5484D] transition-[clip-path]",
              isHold ? "duration-100 ease-linear" : "duration-200 ease-out"
            )}
            style={{
              clipPath: `inset(0 ${100 - holdProgress}% 0 0)`
            }}
          >
            <TrashIcon className="w-4 h-4" />
            <span className="ml-2">Hold to delete</span>
          </button>
        </div>
        <p className="text-muted-foreground text-xs">
          Progress: {holdProgress.toFixed(2)}%
        </p>
      </div>
    </div>
  )
}