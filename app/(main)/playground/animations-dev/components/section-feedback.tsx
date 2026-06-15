"use client"
import { useCallback, useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import { useClickInsideOutside } from "@/hooks/use-click-inside-outside"
import { LoaderIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SectionFeedback() {
  return (
    <div className="subsection mt-32">
      <div className="font-bold text-2xl">
        <div>
          <h2>Build a Feedback Popover</h2>
        </div>
      </div>
      <div className="cp">
        <p>
          这是一个反馈弹窗组建，主要展示了当组建拥有多个状态时，如何使用 Framer Motion 进行动画过度。
        </p>
      </div>

      {/* 展示反馈弹窗的示例 */}
      <div className="content-showcase py-8 mt-8">
        <FeedbackPopover />
      </div>

      <div className="cp mt-8">
        <p>
          难点1: 点击按钮后，feedback 文字移动到左上角的动画过度
        </p>
        <ol>
          <li>使用 <code>layoutId</code> 来关联按钮上的文字和 <code>textarea</code> 上的 feedback 文字</li>
          <li>弹窗展开后的 feedback 使用 <code>absolute</code> 定位，若使用 <code>flex</code> 则文字在变化过程中，无法保持形状</li>
        </ol>
        <p>
          难点2: 组建的架构
        </p>
        <ol>
          <li>父组建（<code>表单</code>）：数据、状态存储逻辑、提交逻辑、请求逻辑</li>
          <li>子组建（<code>提交按钮</code>）：接受父组建传递表单状态，根据状态显示不同的按钮文本。其功能仅作为触发，使用 <code>type=&quot;submit&quot;</code> 来触发提交逻辑</li>
        </ol>
        <p>
          细节
        </p>
        <ol>
          <li>提交类型的组建，记得添加键盘事件：监听 <code>Ctrl+Enter</code> 或 <code>Cmd+Enter</code> 键作为提交触发；监听 <code>Escape</code> 键作为关闭弹窗触发</li>
          <li><code>useEffect</code>依赖不稳定的函数，则需要将函数包裹在 <code>useCallback</code> 中。
          <b>不稳定的函数</b>是指每次 render 都会改变的函数</li>
          <li>render 何时发生：当组件的状态（内部 state）、依赖项（props）变化时，会触发 render</li>
        </ol>
      </div>
    </div>
  )
}

export function FeedbackPopover() {
  const [isOpen, setIsOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  useClickInsideOutside(popoverRef, () => { }, () => setIsOpen(false))

  const [formState, setFormState] = useState<"idle" | "success" | "loading">("idle")
  const [feedback, setFeedback] = useState("")

  const submit = useCallback((e?: React.FormEvent) => {
    e?.preventDefault()

    if (!feedback.trim() || formState === "loading") return;

    setFormState("loading")
    setTimeout(() => {
      setFormState("success")
    }, 2000)
    setTimeout(() => {
      setFormState("idle")
      setFeedback("")
      setIsOpen(false)
    }, 4500)
  }, [feedback, formState])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false)
      };
      if (
        (e.ctrlKey || e.metaKey) &&
        e.key === "Enter" && formState === "idle"
      ) {
        submit()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [formState, submit])

  return (
    <div className="flex h-[200px] justify-center items-center w-full">
      <motion.button
        layoutId="feedback-wrapper"
        className="relative flex items-center h-9 border border-[#e9e9e7] bg-white px-3 font-medium outline-0"
        style={{
          borderRadius: "8px",
        }} onClick={() => setIsOpen(!isOpen)}>
        <motion.span className="block text-sm text-accent-foreground" layoutId="feedback-title">Feedback</motion.span>
      </motion.button>
      <AnimatePresence>
        {
          isOpen && (
            <motion.div
              ref={popoverRef}
              layoutId="feedback-wrapper"
              className="absolute h-[192px] w-[364px] overflow-hidden bg-[#f5f6f7] p-1 border shadow-xs outline-0" style={{ borderRadius: "12px" }}
            >
              <motion.span
                layoutId="feedback-title"
                className={cn(
                  "absolute text-sm text-muted-foreground left-4 top-[17px]",
                  feedback.trim() ? "hidden" : "block",
                )}
              >
                Feedback
              </motion.span>
              {
                formState === "success" ? (
                  <motion.div
                    className="flex flex-col h-full items-center justify-center gap-2"
                    initial={{ opacity: 0, y: -25, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  >
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M27.6 16C27.6 17.5234 27.3 19.0318 26.717 20.4392C26.1341 21.8465 25.2796 23.1253 24.2025 24.2025C23.1253 25.2796 21.8465 26.1341 20.4392 26.717C19.0318 27.3 17.5234 27.6 16 27.6C14.4767 27.6 12.9683 27.3 11.5609 26.717C10.1535 26.1341 8.87475 25.2796 7.79759 24.2025C6.72043 23.1253 5.86598 21.8465 5.28302 20.4392C4.70007 19.0318 4.40002 17.5234 4.40002 16C4.40002 12.9235 5.62216 9.97301 7.79759 7.79759C9.97301 5.62216 12.9235 4.40002 16 4.40002C19.0765 4.40002 22.027 5.62216 24.2025 7.79759C26.3779 9.97301 27.6 12.9235 27.6 16Z"
                        fill="#2090FF"
                        fillOpacity="0.16"
                      />
                      <path
                        d="M12.1334 16.9667L15.0334 19.8667L19.8667 13.1M27.6 16C27.6 17.5234 27.3 19.0318 26.717 20.4392C26.1341 21.8465 25.2796 23.1253 24.2025 24.2025C23.1253 25.2796 21.8465 26.1341 20.4392 26.717C19.0318 27.3 17.5234 27.6 16 27.6C14.4767 27.6 12.9683 27.3 11.5609 26.717C10.1535 26.1341 8.87475 25.2796 7.79759 24.2025C6.72043 23.1253 5.86598 21.8465 5.28302 20.4392C4.70007 19.0318 4.40002 17.5234 4.40002 16C4.40002 12.9235 5.62216 9.97301 7.79759 7.79759C9.97301 5.62216 12.9235 4.40002 16 4.40002C19.0765 4.40002 22.027 5.62216 24.2025 7.79759C26.3779 9.97301 27.6 12.9235 27.6 16Z"
                        stroke="#2090FF"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <h3 className="font-semibold text-sm">Feedback received!</h3>
                    <p className="text-muted-foreground text-sm">Thanks for helping me improve Sonner.</p>
                  </motion.div>
                ) : (
                  <form
                    className="rounded-[8px] border border-[#e6e7e8] bg-white"
                    onSubmit={submit}>
                    <textarea
                      placeholder="Feedback"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="w-full h-32 resize-none rounded-t-[8px] p-3 font-sm outline-0 placeholder:opacity-0 text-sm"
                      disabled={formState === "loading"}
                      required
                    />
                    <div
                      id="feedback-footer"
                      className="relative flex items-center h-12 px-[10px]"
                    >
                      <svg
                        className="absolute left-0 -top-px"
                        width="352"
                        height="2"
                        viewBox="0 0 352 2"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M0 1H352" stroke="#E6E7E8" strokeDasharray="4 4" />
                      </svg>
                      <div className="absolute top-0 left-0 translate-x-[-1.5px] translate-y-[-50%]">
                        <svg
                          width="6"
                          height="12"
                          viewBox="0 0 6 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_2029_22)">
                            <path
                              d="M0 2C0.656613 2 1.30679 2.10346 1.91341 2.30448C2.52005 2.5055 3.07124 2.80014 3.53554 3.17157C3.99982 3.54301 4.36812 3.98396 4.6194 4.46927C4.87067 4.95457 5 5.47471 5 6C5 6.52529 4.87067 7.04543 4.6194 7.53073C4.36812 8.01604 3.99982 8.45699 3.53554 8.82843C3.07124 9.19986 2.52005 9.4945 1.91341 9.69552C1.30679 9.89654 0.656613 10 0 10V6V2Z"
                              fill="#F5F6F7"
                            />
                            <path
                              d="M1 12V10C2.06087 10 3.07828 9.57857 3.82843 8.82843C4.57857 8.07828 5 7.06087 5 6C5 4.93913 4.57857 3.92172 3.82843 3.17157C3.07828 2.42143 2.06087 2 1 2V0"
                              stroke="#E6E7E8"
                              strokeWidth="1"
                              strokeLinejoin="round"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_2029_22">
                              <rect width="6" height="12" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                      </div>
                      <div className="absolute top-0 right-0 translate-x-[1.5px] translate-y-[-50%] rotate-180">
                        <svg
                          width="6"
                          height="12"
                          viewBox="0 0 6 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_2029_22)">
                            <path
                              d="M0 2C0.656613 2 1.30679 2.10346 1.91341 2.30448C2.52005 2.5055 3.07124 2.80014 3.53554 3.17157C3.99982 3.54301 4.36812 3.98396 4.6194 4.46927C4.87067 4.95457 5 5.47471 5 6C5 6.52529 4.87067 7.04543 4.6194 7.53073C4.36812 8.01604 3.99982 8.45699 3.53554 8.82843C3.07124 9.19986 2.52005 9.4945 1.91341 9.69552C1.30679 9.89654 0.656613 10 0 10V6V2Z"
                              fill="#F5F6F7"
                            />
                            <path
                              d="M1 12V10C2.06087 10 3.07828 9.57857 3.82843 8.82843C4.57857 8.07828 5 7.06087 5 6C5 4.93913 4.57857 3.92172 3.82843 3.17157C3.07828 2.42143 2.06087 2 1 2V0"
                              stroke="#E6E7E8"
                              strokeWidth="1"
                              strokeLinejoin="round"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_2029_22">
                              <rect width="6" height="12" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                      </div>
                      <SubmitButton formState={formState} />
                    </div>
                  </form>
                )
              }
            </motion.div>
          )
        }
      </AnimatePresence>
    </div>
  )
}


function SubmitButton({
  formState
}: {
  formState: "idle" | "loading" | "success";
}) {
  const buttonCopy = {
    idle: "Send feedback",
    loading: <LoaderIcon size={16} color="rgba(255, 255, 255, 0.8)" className="animate-spin" />,
    success: "",
  };
  const variants = {
    intro: { y: -25, opacity: 0 },
    show: { y: 0, opacity: 1 },
    exit: { y: 25, opacity: 0 },
  }
  return (
    <Button
      type="submit"
      size="sm"
      variant="outline"
      className="w-28 ml-auto bg-linear-to-b from-blue-400 to-blue-500 text-white hover:text-white cursor-pointer text-xs"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={formState}
          variants={variants}
          initial="intro"
          animate="show"
          exit="exit"
          transition={{ type: "spring", duration: 0.3, bounce: 0 }}
        >
          {buttonCopy[formState]}
        </motion.span>
      </AnimatePresence>
    </Button>
  )
}