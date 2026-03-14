"use client"
import { motion, AnimatePresence } from "motion/react";
import OuterLink from "@/components/link";
import { Experiment1 } from "./components/e1";
import { Experiment2A } from "./components/e2-a";
import { Experiment2B } from "./components/e2-b";
import { Experiment2C } from "./components/e2-c";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function ImageExpandAnimationPage() {
  return (
    <div className="page-top-margin sm:pb-8 section">
      <header className="subsection">
        <h1 className="headline font-serif font-light soft-70">Experiment with Layout Animation</h1>
        <div className="mt-8 font-medium text-sm text-muted-foreground">
          <p>
            Some experiments about <code>framer-motion</code>&nbsp;
            <OuterLink href="https://motion.dev/docs/react-layout-animations?platform=react">layout animation</OuterLink>&nbsp;
            and <OuterLink href="https://motion.dev/docs/react-animate-presence?platform=react">AnimatePresence</OuterLink>.
          </p>
        </div>
      </header>

      <div className="subsection mt-32">
        <h2 className="ch2">Why use Layout Animation</h2>
        <div className="cp">
          <p>
            <code>motion</code> 的 <code>layout</code> 动画主要解决的是原生 js 和 css 中布局动画难以实现的问题。
            下面我总结一下我们通常会面对的两类布局动画。
          </p>
          <p>
            第一种情况，元素在始终同一个容器内，容器布局变化。比如 <code>flex-direction</code> 从横向变换成纵向；
          </p>
          <p>
            第二种情况，元素在不同的布局容器中变化，元素从原有的布局容器 <code>a</code> 中脱离出来，进入一个新的布局容器 <code>b</code> 中。
            比如一个图片瀑布流，每次点击后显示放大图片的详情页，但是详情页的布局已经脱离了原有的瀑布流布局。
          </p>
        </div>
      </div>

      <LayoutAnimationUnderSameContainer />
      <LayoutAnimationInDifferentContainer />
      <Experiment1 />

      <div className="subsection mt-32">
        <h2 className="ch2">Experiment 2: AnimatePresence with layoutId</h2>
        <Experiment2C />
        <hr className="w-full my-8" />
        <Experiment2A />
        <hr className="w-full my-8" />
        <Experiment2B />
        <hr className="w-full my-8" />
        <h3 className="font-bold mt-16">§ E2 Summary</h3>
        <div className="mt-8 space-y-6 [&>p+ol]:-mt-4 text-base text-muted-foreground">
          <p>
            <code>AnimatePresence</code> is very suitable for complex layout animation.
          </p>
          <p><strong>Use AnimatePresence when:</strong></p>
          <ul>
            <li>
              The layout transition involves more than a single standlone element
            </li>
            <li>
              The trigger element might be one a fragment within a large, reconfigured layout.
            </li>
            <li>
              To maintain clean styling logic,
              it is preferable to separate the &apos;before&apos; and &apos;after&apos; states into distinct components
              rather than overloading a single element with conflicting styles
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function LayoutAnimationUnderSameContainer() {
  const [isTriggered, setIsTriggered] = useState(true)
  const A = <b className="text-green-600">A</b>
  const B = <b className="text-amber-600">B</b>
  return (
    <div className="subsection mt-16">
      <h2 className="ch2">Under the same container</h2>
      <div className="cp">
        <p>将 <code>layout</code> 属性添加在子元素 {B} 上，当容器 {A} 的布局变化时，{code.motion} 则会自动为 {B} 添加过渡动画。</p>
      </div>
      <div className="csc mt-8">
        <span className="text-green-600">A: flex-{isTriggered ? "start" : "end"}</span>
        <div
          className={cn(
            "w-36 h-18 bg-green-100 border-2 border-dashed border-green-400 rounded-full flex items-center p-2 cursor-pointer",
            isTriggered ? "justify-start" : "justify-end"
          )}
          onClick={() => setIsTriggered(!isTriggered)}
        >
          <motion.div layout className="size-14 bg-amber-100 border-2 border-dashed border-amber-400 rounded-full flex items-center justify-center text-amber-600">
            B
          </motion.div>
        </div>
      </div>
      <div className="cp">
        <p><b>或者</b> 为子元素 {B} 添加 {code.layoutId} 属性，当容器 {A} 的布局变化时，{code.motion} 可以根据 {code.layoutId} 跟踪 {B}，并添加过渡动画。</p>
      </div>
      <div className="csc mt-8">
        <span className="text-green-600">A: flex-{isTriggered ? "start" : "end"}</span>
        <div
          className={cn(
            "w-36 h-18 bg-green-100 border-2 border-dashed border-green-400 rounded-full flex items-center p-2 cursor-pointer",
            isTriggered ? "justify-start" : "justify-end"
          )}
          onClick={() => setIsTriggered(!isTriggered)}
        >
          <motion.div
            layoutId="B"
            className="h-14 w-16 bg-amber-100 border-2 border-dashed border-amber-400 rounded-full flex flex-col items-center justify-center text-amber-600 text-xs"
          >
            <div>layoutId</div>
            <div>B</div>
          </motion.div>
        </div>
      </div>
      <div className="cp">
        <p>{code.layoutId} 也通常用于多个子元素 {B} 在容器 {A} 中的布局变化的场景。</p>
      </div>
      <div className="csc mt-8">
        <span className="text-green-600">A: flex-{isTriggered ? "col" : "row"}</span>
        <div
          className={cn("flex size-30 p-2 border-2 border-dashed border-green-400 rounded-2xl bg-green-100 items-start justify-center gap-1 cursor-pointer", isTriggered ? "flex-col" : "flex-row")}
          onClick={() => setIsTriggered(!isTriggered)}
        >
          {Array.from({ length: 3 }, (_, i) => (
            <motion.div
              layoutId={i.toString()}
              key={i}
              className="size-8 border-2 border-dashed border-amber-400 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center"
            >
              <motion.span layout>B{i}</motion.span>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="cp">
        <p>总结一下，当我希望当容器 {A} 的布局变化时，子元素 {B} 的过渡自然：</p>
        <ol>
          <li>
            子元素 {B} 添加 {code.layoutId} 属性 <b>或者</b> {code.layout}
          </li>
          <li>
            通过一些触发方式，通过 <code>className</code> or <code>style</code> 改变容器 {A} 的布局样式
          </li>
        </ol>
      </div>
    </div>
  )
}

function LayoutAnimationInDifferentContainer() {
  const [isTriggered, setIsTriggered] = useState(false)
  const [activated, setActivated] = useState<"c1" | "c2" | null>(null)
  const A = <b className="text-green-600">A</b>
  const B = <b className="text-amber-600">B</b>
  const C = <b className="text-purple-600">C</b>
  const C1 = <b className="text-purple-600">C-1</b>
  const C2 = <b className="text-blue-600">C-2</b>

  return (
    <div className="subsection mt-16">
      <h2 className="ch2">In different containers</h2>
      <div className="cp mt-8">
        <p>下面这个例子展示了元素 {C} 如何在不同的容器 {A} 和 {B} 中进行过渡动画。</p>
        <p>具体来讲就是先编写 {A} 和其包裹的 {C}，以及 {B} 和其中的 {C}。
          然后再通过一个布尔值，控制是在 {A} 还是 {B} 中展示 {C}。
        </p>
        <p>然后给这两个 {C} 添加相同的 <code>layoutId</code>，</p>
        <p>这样 {code.motion} 就会根据 {code.layoutId} 跟踪 {C}，并添加过渡动画。</p>
      </div>
      <div className="csc mt-8 flex-row justify-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <span className="text-green-600">A</span>
          <div className="w-36 h-18 bg-green-100 border-2 border-dashed border-green-400 rounded-full flex items-center p-2 cursor-pointer justify-center"
            onClick={() => setIsTriggered(!isTriggered)}
          >
            <motion.div
              layoutId="C"
              className="w-full h-full bg-purple-100 border-2 border-dashed border-purple-400 rounded-full flex items-center justify-center text-purple-600">
              C
            </motion.div>
          </div>
        </div>
        <div className="flex flex-row items-center gap-2">
          <div className="w-18 h-36 bg-amber-100 border-2 border-dashed border-amber-400 rounded-full flex items-center p-2 cursor-pointer justify-end"
            onClick={() => setIsTriggered(!isTriggered)}
          >
            {
              isTriggered && (
                <motion.div layoutId="C" className="w-full h-full bg-purple-100 border-2 border-dashed border-purple-400 rounded-full flex items-center justify-center text-purple-600">
                  C
                </motion.div>
              )
            }
          </div>
          <span className="text-amber-600">B</span>
        </div>
      </div>
      {/* <h3 className="ch3 mt-8">Shared Layout</h3>
      <div className="cp mt-8">
        <p>
          现在我们将情况稍微复杂化一下。假设现在有了更多的子元素 {C1} 和 {C2} 以列表的形式展示在 {A} 中。
          当我点击某个 C 时，它会变化到 {B} 布局中。也就说 {C1} 和 {C2} 激活时共享 {B} 的布局。
        </p>
      </div>
      <div className="csc mt-8 flex-row justify-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <span className="text-green-600">A</span>
          <div className="w-36 p-2 bg-green-100 border-2 border-dashed border-green-400 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer">
            <div className="w-full h-12"
              onClick={() => setActivated("c1")}
            >
              {
                activated !== "c1" && (
                  <motion.div
                    layoutId="c1"
                    className="w-full h-full bg-purple-100 border-2 border-dashed border-purple-400 rounded-full flex items-center justify-center text-purple-600">
                    c1
                  </motion.div>
                )
              }
            </div>
            <div className="w-full h-12"
              onClick={() => {
                setActivated("c2")
              }}
            >
              {
                activated !== "c2" && (
                  <motion.div
                    layoutId="c2"
                    className="w-full h-full bg-blue-100 border-2 border-dashed border-blue-400 rounded-full flex items-center justify-center text-blue-600">
                    c2
                  </motion.div>
                )
              }
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center gap-2">
          <div className="w-18 h-36 bg-amber-100 border-2 border-dashed border-amber-400 rounded-full flex items-center p-2 cursor-pointer justify-end"
            onClick={() => setActivated(null)}
          >
            {
              activated && (
                <motion.div
                  id={activated}
                  layoutId={activated}
                  className={cn("w-full h-full border-2 border-dashed rounded-full flex items-center justify-center", activated === "c1" ? "bg-purple-100 border-purple-400 text-purple-600" : "bg-blue-100 border-blue-400 text-blue-600")}>
                  {activated}
                </motion.div>
              )
            }
          </div>
          <span className="text-amber-600">B</span>
        </div>
      </div> */}
    </div>
  )
}

const code = {
  layoutId: <code>layoutId</code>,
  layout: <code>layout</code>,
  motion: <code>motion</code>,
}