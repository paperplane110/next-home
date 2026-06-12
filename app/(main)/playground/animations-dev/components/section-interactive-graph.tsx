"use client"

import OuterLink from "@/components/link"
import { motion, useMotionTemplate, useSpring } from "motion/react"
import { useRef } from "react"

export function SectionInteractiveGraph() {
  return (
    <div className="subsection mt-32">
      <div className="font-bold text-2xl">
        <h2>Interactive Graph</h2>
      </div>

      <div className="cp">
        <p className="text-accent-foreground font-semibold">实战练习：可交互式的图表</p>
        <ul>
          <li>图表随着鼠标的移动，逐渐展示</li>
          <li>当鼠标离开图表时，图表会全部展示</li>
        </ul>
      </div>

      <div className="csc pb-4 mt-8">
        <Graph />
      </div>

      <div className="cp">
        <p>
          首先，图表从左到右逐渐展示，这里可以用到前面学过的  <code>clipPath</code> 动画。设置图表 svg 的右侧截取范围即可。
        </p>
        <p>
          然后就是实现图表和鼠标的随动。在上一节我们已经可以通过 <code>useSpring</code> 实现鼠标的跟随了。
          但是这里有一点特殊，<code>style</code> 的 <code>clipPath</code> 的属性值 <code>{`inset(0 \${rightInset}% 0 0)`}</code> 是一个字符串模版。
          因此这里需要使用 <OuterLink href="https://motion.dev/docs/react-use-motion-template" target="_blank"><code>useMotionTemplate</code></OuterLink> 来生成动态的字符串。
        </p>
        <p>
          最后是实现鼠标离开后，图表自动全部展示。
          使用 <code>window.setTimeout()</code> 来实现。同时我们需要存下来这个 timeout 的 id，并在鼠标进入时清除它，以免内存泄漏。
          可以使用 <code>{`useRef<number | null>`}</code> 来存放这个 timeout 的 id 。
        </p>
      </div>
    </div>
  )
}

function Graph() {
  const SPRING = { damping: 18 }

  const rightInset = useSpring(0, SPRING)
  const clipPathTemplate = useMotionTemplate`inset(0 ${rightInset}% 0 0)`
  const timeoutRef = useRef<number | null>(null)
  return (
    <div
      className="relative w-full"
      onPointerMove={(e) => {
        const bound = e.currentTarget.getBoundingClientRect()
        rightInset.set((bound.right - e.clientX) / bound.width * 100)
      }}
      onPointerLeave={() => {
        timeoutRef.current = window.setTimeout(() => {
          rightInset.set(0)
        }, 1000)
      }}
      onPointerEnter={() => {
        if (timeoutRef.current) {
          window.clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = null
      }}
    >
      <motion.svg
        style={{
          clipPath: clipPathTemplate
        }}
        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 644 188">
        <path
          stroke="#0090FF"
          strokeWidth="2"
          d="M1 118.5s82.308-15.501 113.735-29 74.769-1.713 121.217-12c37.596-8.328 58.517-15.006 93.781-30.5 80.146-35.215 123.213-16 154.141-24.5S635.97.849 644 1.5"
        ></path>
        <path
          fill="url(#paint0_linear_540_31)"
          d="M113.912 89.012C82.437 102.511 1 118.01 1 118.01V188h643V1.023c-8.043-.65-129.399 12.499-160.375 20.998-30.976 8.498-74.11-10.714-154.38 24.496-35.319 15.493-56.272 22.17-93.927 30.497-46.52 10.286-89.93-1.5-121.406 11.998"
        ></path>
        <defs>
          <linearGradient
            id="paint0_linear_540_31"
            x1="322.5"
            x2="322.5"
            y1="1"
            y2="188"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#138EED" stopOpacity="0.4"></stop>
            <stop offset="1" stopColor="#058FFB" stopOpacity="0"></stop>
          </linearGradient>
        </defs>
      </motion.svg>
    </div>
  );
}
