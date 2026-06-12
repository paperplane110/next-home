"use client"

import OuterLink from "@/components/link"
import { TrashAnimation } from "./trash-animation"

export function SectionTrashAnimation() {
  return (
    <div className="subsection mt-32">
      <div className="font-bold text-2xl">
        <div>
          <h2>Build a Trash Animation Component</h2>
        </div>
      </div>
      <div className="csc mt-8 pt-0 pb-0">
        <TrashAnimation />
      </div>
      <div className="cp">
        <p className="text-accent-foreground font-semibold">
          技术要点：
        </p>
        <p>
          这个组件最吸引人的地方有二，一是图片选中删除时，会有一段<span className="font-semibold text-accent-foreground">抛物线动画</span>；其次是图片删除后，会被<span className="font-semibold text-accent-foreground">丢进垃圾桶</span>。
        </p>
        <p>
          首先这里记录一下<span className="font-semibold text-accent-foreground">抛物线动画</span>，是如何实现的。
          这段动画使用了 <code>motion layoutId</code> 来关联两种布局下的相同图片，实现了图片从 <code className="text-green-600 font-semibold">Grid</code> 到 <code className="text-blue-600 font-semibold">TrashBin</code> 上方的移动。
          但是这种移动是直线移动。若想实现抛物线，我们首先修改 <code className="text-blue-600 font-semibold">TrashBin</code> 上方图片的布局
          让图片的父元素盒子先是靠上，然后在其进入动画中让其向下。
          所以可以总结为：<span className="underline">通过 <code>layoutId</code> 实现图片直线移动到下一个位置；通过父元素的向下移动，实现抛物线效果</span>。
        </p>
        <p>
          然后就是<span className="font-semibold text-accent-foreground">丢进垃圾桶</span>的动画了。
          我们复用上述抛物线的思路，当确认删除时，将图片的父元素整体沿纵向向下移动即可。
        </p>
        <p>在教程的结尾遗留了个小 bug，这里记录一下解决方案。</p>
        <p className="text-accent-foreground font-semibold">
          Homework: 解决图片删除后，会有归位的虚影
        </p>
        <p>
          首先问题出现在图片从 <code className="text-blue-600 font-semibold">TrashBin</code> 布局返回 <code className="text-green-600 font-semibold">Grid</code>
          布局的过程中，因此查阅官方文档中关于 <code>Layout Animation</code> 的部分：<OuterLink href="https://motion.dev/docs/react-layout-animations#customise-a-layout-animation" target="_blank">Customise a Layout Animation</OuterLink>。
        </p>
        <p>
          文档中说，在 <code className="text-green-600 font-semibold">Grid</code> 布局下定义的 <code>transition</code> 属性，是用来定义元素从 <code className="text-blue-600 font-semibold">TrashBin</code> -&gt; <code className="text-green-600 font-semibold">Grid</code>
          这一过程的动画的。于是我们定义这段过渡动画的持续时长为 0 以消除虚影。
        </p>

      </div>
    </div>
  )
}