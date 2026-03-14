"use client"

import { Button } from "@/components/ui/button";
import { CheckIcon, LoaderIcon, SaveIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { useMeasure } from "react-use";

export default function SectionFramerBasic() {
  return (
    <div className="subsection mt-16">
      <div className="font-bold text-2xl">
        <div>

        </div>
        <h2>The Basics</h2>
      </div>
      <div className="cp">
        <p><code>Motion</code> 动画需要从两个维度来定义</p>
        <ol>
          <li>初始 <code>initial</code>、动画后 <code>animate</code>、退出时 <code>exit</code> 的状态</li>
          <li>过渡 <code>transition</code>，定义动画的时长、缓动函数等</li>
        </ol>
        <p>除此之外，我们经常会遇到基于某个布尔值来判断某个元素是否显示的情况，这种时候，
          <code>Motion</code> 提供了 <code>AnimationPresence</code> 用于处理元素销毁时的动画。
        </p>
        <p>比如下面的例子，就结合上述的知识点。使用了 <code>AnimationPresence</code> 来处理图标的消失和出现。
        </p>
      </div>
      <SaveButton />
      <div className="cp">
        <p>为了实现细腻自然的过渡动画，变化涉及三个方面：<code>scale</code>、<code>opacity</code>、<code>filter: blur(...px)</code></p>
      </div>
      <h3 className="mt-16 font-bold">
        Homework: MagicLink button
      </h3>
      <MagicLinkButton />
      <h3 className="mt-16 font-bold">
        Animating Height
      </h3>
      <ToggleHeightComponent />
    </div>
  )
}

function SaveButton() {
  const [isSaved, setIsSaved] = useState(false);
  useEffect(() => {
    let timeoutId = null;
    if (isSaved) {
      timeoutId = setTimeout(() => {
        setIsSaved(false);
      }, 2000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }, [isSaved])
  const variants = {
    hidden: { opacity: 0, scale: 0.5, filter: "blur(10px)" },
    visible: { opacity: 1, scale: 1, filter: "none" }
  }
  return (
    <div className="mt-8 content-showcase">
      <Button
        size="icon"
        variant="outline"
        className="transition-transform active:scale-97"
        onClick={() => setIsSaved(true)}
      >
        <AnimatePresence
          mode="wait"
          initial={false}
        >
          {
            !isSaved ? (
              <motion.span
                key="save"
                variants={variants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ duration: 0.15 }}
              >
                <SaveIcon />
              </motion.span>
            ) : (
              <motion.span
                key="check"
                variants={variants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ duration: 0.15 }}
              >
                <CheckIcon />
              </motion.span>
            )
          }
        </AnimatePresence>
      </Button>
    </div>
  )
}

function MagicLinkButton() {
  const [buttonState, setButtonState] = useState<"idle" | "loading" | "success">("idle");
  const buttonCopy = {
    idle: "Send me a login link",
    loading: <LoaderIcon size={16} color="rgba(255, 255, 255, 0.8)" className="animate-spin" />,
    success: "Login link sent!",
  };
  const variants = {
    intro: { y: -25, opacity: 0 },
    show: { y: 0, opacity: 1 },
    exit: { y: 25, opacity: 0 },
  }
  return (
    <div className="mt-8 content-showcase">
      <Button
        size="sm"
        variant="outline"
        className="w-40 bg-linear-to-b from-blue-400 to-blue-500 text-white hover:text-white cursor-pointer"
        onClick={() => {
          if (buttonState !== "idle") return;
          setButtonState("loading")
          setTimeout(() => {
            setButtonState("success")
          }, 2000)
          setTimeout(() => {
            setButtonState("idle")
          }, 4500)
        }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={buttonState}
            variants={variants}
            initial="intro"
            animate="show"
            exit="exit"
            transition={{ type: "spring", duration: 0.3, bounce: 0 }}
          >
            {buttonCopy[buttonState]}
          </motion.span>
        </AnimatePresence>
      </Button>
    </div>
  )
}

function ToggleHeightComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [height, setHeight] = useState(0);
  const [ref, bounds] = useMeasure<HTMLDivElement>();

  useEffect(() => {
    setHeight(bounds?.height || 0);
  }, [bounds])

  return (
    <div className="flex justify-center">
      <div className="mt-8 relative w-[262px] h-[568px] box-content border-8 border-black rounded-4xl bg-black/40">
        <div className="absolute top-[2%] left-[calc(50%-56px)] w-28 h-6 bg-black rounded-full"></div>
        <Button
          size="sm"
          variant="outline"
          className="absolute top-[30%] left-[calc(50%-80px)] w-40 overflow-hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          <AnimatePresence mode="popLayout">
            <motion.span
              key={isOpen ? "close" : "open"}
              initial={{ y: isOpen ? 25 : -25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: isOpen ? 25 : -25, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3, bounce: 0 }}
            >
              {isOpen ? "Close" : "Open"}
            </motion.span>
          </AnimatePresence>
        </Button>
        <motion.div
          className="absolute bottom-[10%] text-sm mx-4 mt-8 border rounded-2xl overflow-hidden bg-white"
          animate={{ height: height + 64 }}
          transition={{ type: "spring", duration: 0.3, bounce: 0 }}
        >
          <div ref={ref} className="px-4 py-8 flex flex-col gap-4">
            <h3 className="font-bold">Fake Family Drawer</h3>
            <p>
              This is a fake family drawer. Animating height is tricky, but satisfying when it works.
            </p>
            <AnimatePresence mode="popLayout">
              {
                isOpen ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    This extra content will change the height of the drawer. Some even more content to make the drawer taller and taller and taller...
                  </motion.p>
                ) : null}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  )
}