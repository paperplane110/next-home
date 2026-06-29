"use client";
import { useMemo, useState } from "react";
import { useMeasure } from "react-use";
import { AnimatePresence, motion } from "motion/react";
import { Ring } from "./ring";
import { Timer } from "./timer";
import OuterLink from "@/components/link";
import { cn } from "@/lib/utils";

export function WalkthoughDynamicIsland() {

  const [descriptionView, setDescriptionView] = useState<"ring" | "timer" | "orchestration">("ring");
  const [descriptionRef, bounds] = useMeasure<HTMLDivElement>()
  return (
    <div className="subsection mt-32">
      <div className="font-bold text-2xl">
        <div>
          <h2>Build a Dynamic Island</h2>
        </div>
      </div>
      <div className="cp">
        <p>
          我们的目标是复刻 iPhone 上灵动岛的动画效果。
          在这里我们只实现 <span className="highlight">静音模式切换（Ring view）</span>，以及 <span className="highlight">“定时器小组件（Timer view）”</span>。
        </p>
      </div>

      <div className="csc mt-8">
        <DynamicIsland />
      </div>

      <div className="mt-8">
        <motion.div className="flex items-start gap-8">
          <button
            className={cn("relative text-muted-foreground cursor-pointer",
              descriptionView === "ring" && "font-semibold text-accent-foreground"
            )}
            onClick={() => setDescriptionView("ring")}>
            Ring view
            {descriptionView === "ring" && <motion.div layoutId="underline" id="underline" className="absolute bottom-[-2px] left-0 right-0 h-[2px] bg-black" />}
          </button>
          <button
            className={cn("relative text-muted-foreground cursor-pointer",
              descriptionView === "timer" && "font-semibold text-accent-foreground"
            )}
            onClick={() => setDescriptionView("timer")}>
            Timer view
            {descriptionView === "timer" && <motion.div layoutId="underline" id="underline" className="absolute bottom-[-2px] left-0 right-0 h-[2px] bg-black" />}
          </button>
          <button
            className={cn("relative text-muted-foreground cursor-pointer",
              descriptionView === "orchestration" && "font-semibold text-accent-foreground"
            )}
            onClick={() => setDescriptionView("orchestration")}>
            Orchestration
            {descriptionView === "orchestration" && <motion.div layoutId="underline" id="underline" className="absolute bottom-[-2px] left-0 right-0 h-[2px] bg-black" />}
          </button>
        </motion.div>

        <motion.div
          animate={{ height: bounds?.height || 0 }}
          transition={{ ease: "easeInOut" }}
        >
          <div ref={descriptionRef}>
            {
              descriptionView === "ring" && (
                <motion.div
                  className="cp"
                  initial={{ opacity: 0, filter: "blur(2px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                >
                  <p>先单独实现 ring view 的动画效果。ring 小组件主要有两个部分需要进行动画处理：</p>
                  <ol>
                    <li>左侧铃铛部分</li>
                    <li>右侧文字部分</li>
                  </ol>
                  <p>
                    先从 <span className="highlight">右侧的文字</span> 的变化开始做，这部分很简单。
                    文字动画分为两部分：出现动画和退出动画。因此只需要整体包裹 <code>AnimatePresence</code>、并设置好 <code>initial/animate/exit</code> 三个状态就可以了。
                    动画的内容是三个属性：<code>scale</code>、<code>opacity</code>、<code>filter: blur()</code>
                  </p>
                  <p>
                    <span className="highlight">左侧铃铛</span> 的变化稍微复杂些
                  </p>
                  <ol>
                    <li>
                      整体宽度变宽：给最外层的盒子配置 <code>animate</code> 属性，并且根据是否是静音模式，来设置不同的宽度
                    </li>
                    <li>铃铛的红色背景：同上，但使用 <code>absolute</code> 定位，方便 <code>motion</code> 定位</li>
                    <li>铃铛的横向移动：虽然视觉上铃铛没有移动，但是它的布局计算是相对灵动岛左侧的，因此需要一个向右的移动，以维持 <span className="highlight">视觉上位置的静止</span></li>
                    <li>铃铛的禁止斜线：静音时，铃铛被斜线挡住，这个斜线是个 <code>div</code>，因此在进入和退出时配置其宽度变化即可</li>
                    <li>铃铛的摇晃：对铃铛的旋转属性进行动画化，为了实现左右摇晃的效果，可以给 <code>rotate</code> 属性配置
                      <OuterLink href="https://motion.dev/docs/react-animation#keyframes" target="_blank">Keyframes</OuterLink>
                      让旋转角度反复变化
                    </li>
                    <li>
                      铃铛摆锤的摇晃：同上
                    </li>
                  </ol>
                </motion.div>
              )
            }

            {
              descriptionView === "timer" && (
                <motion.div
                  className="cp"
                  initial={{ opacity: 0, filter: "blur(2px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                >
                  <p>
                    计时器的动画主要在于 <span className="highlight">数字的变化</span>。
                  </p>
                  <p>
                    实现的技巧就是首先将时间转为字符串，然后每个字符单独用 <code>motion.span</code> 包裹，方便后续的动画处理。
                  </p>
                  <p><span className="highlight">非常关键的一步</span> ：给每个 <code>motion.span</code> 配置 <code>key={"`${第几位}-${数字}`"}</code> 属性，<code>motion</code> 会根据这个属性来判断这一位数字是否出现和消失。</p>
                  <p>
                    然后就是给字符配置动画，数字是从下往上运动，所以配置 <code>y/opacity/filter: blur()</code> 这几个属性的动画。
                  </p>
                  <p>
                    除此之外，还要注意一些细节。首先是数字的样式需要添加 <code>tabular-nums</code> 类，可以保证数字等宽。
                    上一个数字的上一个数字的退出动画和下一个数字的进入动画要同步进行，所以 <code>AnimatePresence</code> 要使用 <code>popLayout</code> 模式。
                  </p>
                </motion.div>
              )
            }

            {
              descriptionView === "orchestration" && (
                <motion.div
                  className="cp"
                  initial={{ opacity: 0, filter: "blur(2px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                >
                  <p>
                    这一步，我们将上述的 idle、ring、timer 几个视图组装起来，添加丝滑的切换动画。
                    当前状态下，如果切换视图，首先灵动岛大小的改变是没有过渡的。其次，灵动岛内容会直接消失、直接出现。
                    观察一下 Apple 的灵动岛，就会发现，灵动岛大小变化是有“弹性”的，是一种富有生机的感觉，而且内容是淡入淡出效果。
                  </p>
                  <p>所以，我们先来拆解一下我们的目标，并逐一实现：</p>
                  <ol>
                    <li>灵动岛整体的大小变化</li>
                    <li>下一个视图内容淡入</li>
                    <li>上一个视图内容淡出</li>
                  </ol>
                  <p>
                    首先是灵动岛整体的大小变化。由于不同视图的宽高不同，导致了 layout 的变化，所以需要给灵动岛添加 <code>layout</code> 属性，
                    <code>motion</code> 会为大小变化自动添加过渡效果。
                  </p>
                  <p>
                    内容淡入：直接用一个 <code>motion.div</code> 包裹整体，
                    然后配置其 <code>initial/animate</code> 属性，
                    这样就给灵动岛内容整体添加了一个淡入动画
                  </p>
                  <p>
                    内容淡出：为了更加精细的控制淡出效果，完全复制一份灵动岛的内容，但是初始状态是完全透明的，覆盖在原始内容上，作为退出动画的 mask。
                    配置一个 <code>{`exit={{ opacity: [1, 0] }}`}</code> 的属性,
                    这句话的意思是，这个 mask 会在退出时突然出现，覆盖原始内容，并且逐渐变透明。
                  </p>
                  <p>细节打磨</p>
                  <ol>
                    <li>
                      灵动岛整体的大小变化时，在相同的 <code>bounce</code> 参数下，面积越大超调量越多，整个动画的弹性有些过度了，有些太“软”了。
                      所以，我们需要根据结束时灵动岛的大小来决定 <code>bounce</code> 参数。
                      当灵动岛的组件面积越大，<code>bounce</code> 参数就越小，动画的弹性就越小。
                    </li>
                    <li>
                      内容淡出：灵动岛的淡出不仅仅是简单的透明度+模糊的淡出。
                      当从一个小组件变化到大组件时，内容的淡出是<span className="highlight">放大+向下微小位移</span>的淡出。
                      当从一个大组件变化到小组件组件时，内容的淡出是<span className="highlight">缩小+向上微小位移</span>的淡出。
                      为了实现这一效果，需要使用 <code>AnimatePresence</code> 的
                      <OuterLink href="https://motion.dev/docs/react-animate-presence#custom" target="_blank">custom</OuterLink>，
                      以及 <OuterLink href="https://motion.dev/docs/react-animation#dynamic-variants" target="_blank">dynamic-variants</OuterLink>
                    </li>
                  </ol>
                </motion.div>
              )
            }
          </div>
        </motion.div>
      </div>
    </div>
  )
}

type ViewOption = "idle" | "ring" | "timer"

function DynamicIsland() {
  const [view, setView] = useState<ViewOption>("idle")
  const [variantKey, setVariantKey] = useState<string>("idle")

  const content = useMemo(() => {
    switch (view) {
      case "idle": {
        return <div className="h-7" />
      }
      case "ring": {
        return <Ring />
      }
      case "timer": {
        return <Timer />
      }
    }
  }, [view])

  return (
    <>
      <div className="relative flex h-[160px] justify-center">
        <motion.div
          layout
          className="h-fit min-w-[100px] overflow-hidden bg-black"
          style={{
            borderRadius: 9999
          }}
          transition={{
            type: "spring",
            bounce: 0.5
          }}
        >
          {/* 通过增加这个外部盒子，给 content 添加了整体的进入动画 */}
          <motion.div
            key={view}
            transition={{
              type: "spring",
              bounce: BOUNCE_VARIANTS[variantKey] ?? 0.5
            }}
            initial={{
              scale: 0.9,
              opacity: 0,
              filter: "blur(5px)",
              originX: 0.5,
              originY: 0.5,
            }}
            animate={{
              scale: 1,
              opacity: 1,
              filter: "blur(0px)",
              originX: 0.5,
              originY: 0.5,
              transition: {
                delay: 0.05
              }
            }}
          >
            {content}
          </motion.div>
        </motion.div>

        <div className="pointer-events-none absolute top-0 left-1/2 translate-x-[-50%] h-[160px] w-[300px] flex items-start justify-center">
          <AnimatePresence
            mode="popLayout"
            custom={ANIMATION_VARIANTS[variantKey]}
          >
            <motion.div
              key={view}
              initial={{ opacity: 0 }}
              exit="exit"
              variants={{
                exit: (transition) => {
                  return {
                    ...transition,
                    opacity: [1, 0],
                    filter: "blur(5px)"
                  }
                }
              }}
            >
              {content}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        {
          ["idle", "ring", "timer"].map((item) => (
            <button
              key={item}
              type="button"
              className="h-10 w-32 rounded-full bg-white px-2.5 py-1.5 text-sm font-medium text-gray-900 capitalize shadow-sm ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
              onClick={() => {
                setView(item as ViewOption)
                setVariantKey(`${view}-${item}`)
              }}
            >
              {item}
            </button>
          ))
        }
      </div>
    </>
  )
}

// 根据 view 变化，决定退出动画效果
const ANIMATION_VARIANTS: Record<string, Record<string, number>> = {
  // 从 ring 到 idle 的退出动画效果，横向收缩
  "ring-idle": {
    scale: 0.9,
    scaleX: 0.9,
    bounce: 0.5,
  },
  // 从 timer 到 ring 的退出动画效果，从大到小，且向上移动
  "timer-ring": {
    scale: 0.7,
    y: -7.5,
    bounce: 0.35,
  },
  "ring-timer": {
    scale: 1.4,
    y: 7.5,
    bounce: 0.35,
  },
  "timer-idle": {
    scale: 0.7,
    y: -7.5,
    bounce: 0.3,
  },
};

// 根据 view 变化，决定进入时的弹跳程度，当面积大时，减少 bounce 效果，使动画更平滑过渡。
const BOUNCE_VARIANTS: Record<string, number> = {
  "idle": 0.5,
  "ring-idle": 0.5,
  "timer-ring": 0.35,
  "ring-timer": 0.35,
  "timer-idle": 0.3,
  "idle-timer": 0.3,
  "idle-ring": 0.5,
};