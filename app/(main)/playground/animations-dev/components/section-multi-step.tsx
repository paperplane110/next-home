"use client"
import { useMemo, useState } from "react"
import { useMeasure } from "react-use"
import { motion, AnimatePresence, MotionConfig } from "motion/react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import OuterLink from "@/components/link"

export function SectionMultiStep() {
  return (
    <div className="subsection mt-32">
      <div className="font-bold text-2xl">
        <div>
          <h2>Build a Multi-Step Component</h2>
        </div>
      </div>
      <div className="cp">
        <p>
          这是一个多步骤组件，用于展示多步骤引导。这个例子使用 Framer Motion 进行动画过度。
        </p>
      </div>
      <div className="csc mt-4">
        <MultiStepComponent />
      </div>
      <div className="cp mt-4">
        <p className="text-accent-foreground font-semibold">
          第一步：实现文字的横向进入/退出
        </p>
        <ol>
          <li>使用 <code>AnimatePresence</code> 包裹步骤的文字内容</li>
          <li>使用 <code>key={`step-$\{currentStep\}`}`</code> 来区分每个步骤的 <code>div</code>，这样 motion 就可以追踪并妥善处理这些子元素的进入/退出动画了</li>
          <li>给子元素添加 <code>initial/animate/exit</code> 动画定义</li>
        </ol>
        <p>
          还有一些需要注意的细节
        </p>
        <ol>
          <li><code>AnimatePresence</code> 的模式为 <code>popLayout</code>。意思是当前子元素的退出动画和下一个子元素的进入动画是并行的</li>
          <li><code>AnimatePresence</code> 的 <code>initial={false}</code> 是为了在组件挂载时不使用动画，直接显示内容</li>
        </ol>
        <p className="text-accent-foreground font-semibold">
          第二步：容器的高度动画
        </p>
        <ol>
          <li>在卡片最外层内侧，用一个 <code>div</code> 包裹其余内容，叫做 inner</li>
          <li>使用 <code>useMeasure</code> 来测量 inner 的高度</li>
          <li>拿到上一步中的 <code>bounds.height</code>，来定义最外部的容器高度动画 <code>{`animate={{ height: bounds.height }}`}</code></li>
        </ol>
        <p>
          细节
        </p>
        <ol>
          <li>为了让下方的按钮的位置不会跳跃，我们在按钮的容器上添加 <code>layout</code> 属性，
            令 motion 来处理其父元素 layout 变化所导致的位置变化</li>
          <li>
            为了让下方的按钮和高度变化保持同步，我们需要在最外层使用 <code>MotionConfig</code>，
            让高度和按钮位置的过渡动画拥有一样的 duration 等配置。
          </li>
        </ol>
        <p className="text-accent-foreground font-semibold">
          第三步：纠正动画方向
        </p>
        <p>文字的移动方向应该根据 back 或者 next 来决定是向左还是向右移动。</p>
        <ol>
          <li>
            本质上这个问题就是根据外部条件，动态的决定动画属性。<code>motion</code> 提供了以下解决方案：
            <OuterLink href="https://motion.dev/docs/react-animation#dynamic-variants" target="_blank">dynamic-variants</OuterLink>
          </li>
          <li>
            但是对于退出的元素，在退出时元素被删除，无法改动其 exit 属性。
            所幸 <code>motion</code> 的 <code>AnimatePresence</code> 可以解决这个问题。
            <OuterLink href="https://motion.dev/docs/react-animate-presence#custom" target="_blank">custom</OuterLink>
          </li>
        </ol>
      </div>
    </div>
  )
}

type Direction = 1 | -1

function MultiStepComponent() {
  const [currentStep, setCurrentStep] = useState(0);
  const [ref, bounds] = useMeasure<HTMLDivElement>();

  const [direction, setDirection] = useState<Direction>(1);

  const variants = {
    initial: (direction: Direction) => {
      return { x: `${110 * direction}%`, opacity: 0 };
    },
    active: { x: "0%", opacity: 1 },
    exit: (direction: Direction) => {
      return { x: `${-110 * direction}%`, opacity: 0 };
    },
  };

  const content = useMemo(() => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <h2 className="font-bold">This is step one</h2>
            <p className="mt-4">
              Usually in this step we would explain why this thing exists and
              what it does. Also, we would show a button to go to the next step.
            </p>
            <div className="flex flex-col gap-2 mt-5 overflow-hidden">
              <Skeleton className="h-4 rounded-sm w-[256px]" />
              <Skeleton className="h-4 rounded-sm w-[192px]" />
              <Skeleton className="h-4 rounded-sm w-[200px]" />
              <Skeleton className="h-4 rounded-sm w-[386px]" />
            </div>
          </>
        );
      case 1:
        return (
          <>
            <h2 className="font-bold">This is step two</h2>
            <p className="mt-4">
              Usually in this step we would explain why this thing exists and
              what it does. Also, we would show a button to go to the next step.
            </p>
            <div className="flex flex-col gap-2 mt-5 overflow-hidden">
              <Skeleton className="h-4 rounded-sm w-[256px]" />
              <Skeleton className="h-4 rounded-sm w-[192px]" />
              <Skeleton className="h-4 rounded-sm w-[384px]" />
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h2 className="font-bold">This is step three</h2>
            <p className="mt-4">
              Usually in this step we would explain why this thing exists and
              what it does. Also, we would show a button to go to the next step.
            </p>
            <div className="flex flex-col gap-2 mt-5 overflow-hidden">
              <Skeleton className="h-4 rounded-sm w-[256px]" />
              <Skeleton className="h-4 rounded-sm w-[192px]" />
              <Skeleton className="h-4 rounded-sm w-[128px]" />
              <Skeleton className="h-4 rounded-sm w-[384px]" />
            </div>
          </>
        );
    }
  }, [currentStep]);

  return (
    <MotionConfig transition={{ duration: 0.5, type: "spring", bounce: 0 }}>
      <motion.div
        key="wrapper"
        className="relative w-[420px] max-w-full border p-6 rounded-md shadow-xs overflow-hidden"
        animate={{ height: bounds.height + 48 }}
      >
        <div key="inner" ref={ref}>
          <AnimatePresence mode="popLayout" initial={false} custom={direction}>
            <motion.div
              key={`step-${currentStep}`}
              custom={direction}
              variants={variants}
              initial="initial"
              animate="active"
              exit="exit"
              transition={{ duration: 0.3, type: "spring", bounce: 0 }}
            >
              {content}
            </motion.div>
          </AnimatePresence>
          <motion.div layout layoutId="actions" className="flex justify-between mt-8">
            <Button
              variant="ghost"
              className="cursor-pointer disabled:cursor-not-allowed disabled:pointer-events-auto"
              onClick={() => {
                setCurrentStep(currentStep - 1)
                setDirection(-1)
              }}
              disabled={currentStep === 0}
            >
              Back
            </Button>
            <Button
              variant="outline"
              className="cursor-pointer disabled:cursor-not-allowed disabled:pointer-events-auto"
              onClick={() => {
                setCurrentStep(currentStep + 1)
                setDirection(1)
              }}
              disabled={currentStep === 2}
            >
              Next
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </MotionConfig>
  )
}
