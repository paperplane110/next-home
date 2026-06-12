"use client"

import { motion, useMotionValue, useSpring, useTransform } from "motion/react"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"

export function SectionHooksAndAnimations() {
  return (
    <div className="subsection mt-32">
      <div className="font-bold text-2xl">
        <div>
          <h2>Hooks and Animations</h2>
        </div>
      </div>
      <div className="cp mt-8">
        <p className="text-accent-foreground font-semibold">Motion values</p>
        <p>
          Motion values 是 <code>motion</code> 中的原生变量。
          它独立于 React 的渲染周期之外，可以以接近 60 帧的速度更新。
          motion value 可以直接应用于 <code>motion</code> 元素的 <code>style</code> 中。
        </p>
        <p className="text-accent-foreground font-semibold"><code>useMotionValue()</code></p>
        <p>构造一个 motion value。并且可以手动更新。这种更新是阶跃式的、立即的。</p>
      </div>
      <UseMotionValuesExample />
      <div className="cp mt-8">
        <p className="text-accent-foreground font-semibold"><code>useSpring()</code></p>
        <p>构造一个 motion value。当我们手动更新时，数值遵循 Spring 的特性进行变化。
          可以配置的参数有：
        </p>
        <ol>
          <li><code>stiffness</code>: 弹簧的刚度，值越大，弹簧越刚硬，超调量越小</li>
          <li><code>damping</code>: 弹簧的阻尼，值越大，能够越快的趋于稳定</li>
          <li><code>mass</code>: 弹簧终端物体的质量，值越大，越笨重。</li>
        </ol>
      </div>
      <UseSpringTranslateXExample />
      <div className="cp mt-8">
        <p className="text-accent-foreground font-semibold"><code>useSpring()</code>  with track mouse move</p>
        <p>
          使用 <code>useSpring</code> 来跟踪鼠标移动。
          这样既能实现平滑的跟随动画，又能节省性能开销（因为 motion value 的更新不会触发 React 的重新渲染）。
        </p>
      </div>
      <UseSpringTrackMouseMove />
      <div className="cp mt-8">
        <p className="text-accent-foreground font-semibold"><code>useTransform()</code></p>
        <p>
          构造一个 motion value，它的值是根据其他 motion value 计算得到的。
        </p>
        <p>下面的例子中，圆形的大小由其所在的 y 轴位置决定。鼠标越靠下，圆形越大。</p>
      </div>
      <UseTransformScaleCircle />
    </div>
  )
}

function UseMotionValuesExample() {
  const x = useMotionValue(0)
  return (
    <div className="csc mt-8 pt-8 pb-4 gap-8">
      <motion.div
        className="h-[50px] w-[50px] rounded-xl border-2 border-purple-600 bg-purple-300"
        style={{ x: x }}
      >
      </motion.div>
      <div className="flex justify-between gap-8">
        <Button
          variant="outline"
          size="icon"
          onClick={() => { x.set(x.get() - 50) }}
        >
          <ArrowLeftIcon />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => { x.set(x.get() + 50) }}
        >
          <ArrowRightIcon />
        </Button>
      </div>
    </div>
  )
}

function UseSpringTranslateXExample() {
  const x = useSpring(0, { stiffness: 100, damping: 10, mass: 0.1 })
  return (
    <div className="csc mt-8 pt-8 pb-4 gap-8">
      <motion.div
        className="h-[50px] w-[50px] rounded-xl border-2 border-sky-600 bg-sky-300"
        style={{ x: x }}
      >
      </motion.div>
      <div className="flex justify-between gap-8">
        <Button
          variant="outline"
          size="icon"
          onClick={() => { x.set(x.get() - 50) }}
        >
          <ArrowLeftIcon />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => { x.set(x.get() + 50) }}
        >
          <ArrowRightIcon />
        </Button>
      </div>
    </div>
  )
}

function UseSpringTrackMouseMove() {
  const SPRING = { stiffness: 100, damping: 10, mass: 0.1 }
  const x = useSpring(0, SPRING)
  const y = useSpring(0, SPRING)
  const opacity = useSpring(0)
  return (
    <div 
      className="h-[300px] w-full bg-white border border-dashed border-gray-300 rounded-4xl mt-8"
      onPointerMove={(e) => {
        const bounds = e.currentTarget.getBoundingClientRect()
        x.set(e.clientX - bounds.left)
        y.set(e.clientY - bounds.top)
      }}
      onPointerEnter={() => {
        opacity.set(1)
      }}
      onPointerLeave={() => {
        opacity.set(0)
      }}
    >
      <motion.div
        className="h-[50px] w-[50px] translate-x-[-50%] translate-y-[-50%] rounded-full border-2 border-green-600 bg-green-300"
        style={{ x: x, y: y, opacity: opacity }}
      >
      </motion.div>
    </div>
  )
}

function UseTransformScaleCircle() {
  const SPRING = { stiffness: 100, damping: 10, mass: 0.1 }
  const x = useSpring(0, SPRING)
  const y = useSpring(0, SPRING)
  const scale = useTransform(y, [0, 300], [1, 1.5])
  const opacity = useSpring(0)
  return (
    <div 
      className="h-[300px] w-full bg-white border border-dashed border-gray-300 rounded-4xl mt-8"
      onPointerMove={(e) => {
        const bounds = e.currentTarget.getBoundingClientRect()
        x.set(e.clientX - bounds.left)
        y.set(e.clientY - bounds.top)
      }}
      onPointerEnter={() => {
        opacity.set(1)
      }}
      onPointerLeave={() => {
        opacity.set(0)
      }}
    >
      <motion.div
        className="h-[50px] w-[50px] translate-x-[-50%] translate-y-[-50%] rounded-full border-2 border-green-600 bg-green-300"
        style={{ x: x, y: y, opacity: opacity, scale: scale }}
      >
      </motion.div>
    </div>
  )
}