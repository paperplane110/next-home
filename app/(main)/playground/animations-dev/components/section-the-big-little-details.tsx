"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCcwIcon } from "lucide-react"
import { FeedbackPopover } from "./section-feedback"
import styles from "./section-the-big-little-details.module.css"

export function SectionTheBigLittleDetails() {
  return (
    <div className="subsection mt-32">
      <div className="font-bold text-2xl">
        <div>
          <h2>The Big Little Details</h2>
        </div>
      </div>
      <div className="cp">
        <p>“良好”的动画和“很棒”的动画效果之间存在着一些细节上的差异，下面是我学习到的一些要点</p>
        <h3 className="text-accent-foreground font-semibold mt-12">Feeling</h3>
        <p>
          一个产品、网页会通过动画效果给用户营造一种<span className="highlight">感觉、氛围</span>。
        </p>
        <p>
          <span className="highlight">颜色</span>：颜色能唤起人的某些情绪，比如蓝色等冷色调通常给人带来“安全、稳重、专业”的感觉。
          比如支付宝、飞书、钉钉、Stripe等产品，都使用蓝色等冷色调来营造专业的感觉。
        </p>
        <p>
          <span className="highlight">动画速度 duration</span>：速度是动画的一个重要方面，它能影响到动画的可读性和用户体验。
        </p>
        <p>
          通常在<span className="highlight">产品介绍展示页面</span>中，动画速度是根据产品调性来确定的。如果产品调性是“稳重、优雅、可靠”等，那么动画速度营造沉稳的感觉；
          若产品强调的是“新潮、活泼”等，那么动画速度会比较快，给人以一种敏捷、年轻化的感觉。
        </p>
        <p>
          但是在<span className="highlight">产品本身的交互中</span>中，动画速度通常小于 300ms，以确保用户体验的流畅性。有些使用十分频繁的操作甚至不需要动画效果。
        </p>
        <p><span className="highlight">动画速度曲线 easing</span>：速度曲线定义了一段动画何时快何时慢。
          <code>ease-in</code> 通常感觉更慢，
          而 <code>ease-out</code> 则响应更快，适用于需要快速给用户反馈的场景。
          <code>ease-in-out</code> 则是两者之间的平衡，比较优雅、丝滑流畅。
        </p>

        <h3 className="highlight mt-12">Orchestration</h3>
        <p>动画的编排也是很重要的。当页面中有多个动画时，如何决定他们的播放顺序和时间间隔。</p>
        <StaggerExample />
        <p>上面的例子通过 <code>CSS Keyframes</code> 动画实现了段落文字的逐级展现</p>

        <h3 className="highlight mt-12">Blur</h3>
        <p>模糊效果可以用于两种状态的过渡阶段，可以掩盖一些过渡不自然的瑕疵。</p>
        <div className="content-showcase py-8 mt-8">
          <FeedbackPopover />
        </div>

        <h3 className="highlight mt-12">Review your work</h3>
        <p>
          有时候，沉浸于工作太久，我们可能丧失对这个产品的一些判断力。这时我们需要往后退一步，检查一下我们的动画效果是否符合预期。
          或者邀请他人来 Review 一下，用他人的新视角、新观点来检验我们的动画效果。
        </p>
      </div>
    </div>
  )
}

function StaggerExample() {
  const [refreshId, setRefreshId] = useState(0)
  const COPY = [
    `Using Apple's Sheet component on iOS feels natural, I wanted to create the same experience, but for the web. That's how Vaul, the React component was born.`,
    `Open-sourcing meant that more people will use it, which will result in more feedback, ultimately making the component better.`,
    `I chose to build Vaul on top of Radix's Dialog primitive. Radix ensures the component is accessible, handles focus management etc. I also made Vaul's API is very similar to Radix's, so that it feels familiar.`,
    `Once the content of the drawer got bigger than ~20 list items the drag gesture became laggy, and I couldn't figure out why. `,
    `Since CSS Variables are inheritable, changing them will cause style recalculation for all children, meaning the more items I have in my drawer, the more expensive the calculation gets.`,
  ];
  return (
    <div className="csc px-8 mt-8 relative">
      <Button
        onClick={() => setRefreshId(refreshId + 1)}
        variant="outline" size="icon"
        className="absolute top-8 right-8 transition-transform active:scale-97"
      >
        <RefreshCcwIcon
          className="transition-transform ease-in-out duration-500"
          style={{
            transform: `rotate(${refreshId * -360}deg)`
          }}
        />
      </Button>
      <div key={refreshId} className={`space-y-6 text-accent-foreground ${styles.stagger}`}>
        <h1>Jon Doe</h1>
        {COPY.map((copy, index) => (
          <p
            key={copy}
            style={{
              "--delay": `${index * 150 + 100}ms`
            } as React.CSSProperties}
          >{copy}</p>
        ))}
      </div>
    </div>
  )
}