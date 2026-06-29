"use client"
import { motion, AnimatePresence } from "motion/react"
import { useEffect, useRef, useState } from "react"

function pad2(value: number) {
  return String(value).padStart(2, "0")
}

function formatCountdownSeconds(totalSeconds: number) {
  const seconds = Math.max(0, Math.floor(totalSeconds))

  if (seconds <= 60) {
    return `0:${pad2(seconds)}`
  }

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  if (hours >= 1) {
    return `${hours}:${pad2(minutes)}:${pad2(remainingSeconds)}`
  }

  return `${pad2(minutes)}:${pad2(remainingSeconds)}`
}

export function Timer() {
  const [isPaused, setIsPaused] = useState(false)


  return (
    <div className="flex w-[284px] items-center gap-2 py-3 pr-5 pl-3.5">
      <motion.button
        aria-label="Pause timer"
        className="flex items-center justify-center size-10 rounded-full bg-amber-400/30 hover:bg-amber-400/40 transition-colors"
        onClick={() => setIsPaused(!isPaused)}
        whileTap={{ scale: 0.97 }}
      >
        <AnimatePresence mode="wait">
          {
            isPaused ? (
              <motion.svg
                key="pause"
                initial={{ opacity: 0, scale: 0.7, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.7, filter: "blur(4px)" }}
                transition={{ duration: 0.1 }}
                viewBox="0 0 12 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 fill-current text-[#FDB000]"
              >
                <path d="M0.9375 13.2422C1.25 13.2422 1.51562 13.1172 1.82812 12.9375L10.9375 7.67188C11.5859 7.28906 11.8125 7.03906 11.8125 6.625C11.8125 6.21094 11.5859 5.96094 10.9375 5.58594L1.82812 0.3125C1.51562 0.132812 1.25 0.015625 0.9375 0.015625C0.359375 0.015625 0 0.453125 0 1.13281V12.1172C0 12.7969 0.359375 13.2422 0.9375 13.2422Z" />
              </motion.svg>
            ) : (
              <motion.svg
                key="play"
                initial={{ opacity: 0, scale: 0.7, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.7, filter: "blur(4px)" }}
                transition={{ duration: 0.1 }}
                viewBox="0 0 10 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 fill-current text-[#FDB000]"
              >
                <path d="M1.03906 12.7266H2.82031C3.5 12.7266 3.85938 12.3672 3.85938 11.6797V1.03906C3.85938 0.328125 3.5 0 2.82031 0H1.03906C0.359375 0 0 0.359375 0 1.03906V11.6797C0 12.3672 0.359375 12.7266 1.03906 12.7266ZM6.71875 12.7266H8.49219C9.17969 12.7266 9.53125 12.3672 9.53125 11.6797V1.03906C9.53125 0.328125 9.17969 0 8.49219 0H6.71875C6.03125 0 5.67188 0.359375 5.67188 1.03906V11.6797C5.67188 12.3672 6.03125 12.7266 6.71875 12.7266Z" />
              </motion.svg>
            )
          }
        </AnimatePresence>
      </motion.button>
      <button
        aria-label="close timer"
        className="flex items-center justify-center size-10 rounded-full text-white bg-gray-200/25 hover:bg-gray-200/30 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="white"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <div className="flex-1 border-white flex justify-end gap-1.5 pr-0.5 items-end text-[#F7A815]">
        <span className="text-sm font-medium text-inherit leading-none">
          Timer
        </span>
        <Counter isPaused={isPaused} onAutoPause={() => setIsPaused(true)} />
      </div>
    </div>
  )
}

function Counter({
  isPaused,
  onAutoPause,
}: {
  isPaused: boolean
  onAutoPause: () => void
}) {
  const [count, setCount] = useState(60)
  const endAtMsRef = useRef<number | null>(null)

  const formatted = formatCountdownSeconds(count)

  useEffect(() => {
    if (isPaused) {
      // 暂停时，将剩余的倒数先保存到 count 中，然后清空 endAtMsRef
      if (endAtMsRef.current != null) {
        const remainingSeconds = Math.max(
          0,
          Math.ceil((endAtMsRef.current - Date.now()) / 1000),
        )
        setCount(remainingSeconds)
        endAtMsRef.current = null
      }
      return
    }

    if (count <= 0) return

    if (endAtMsRef.current == null) {
      endAtMsRef.current = Date.now() + count * 1000
    }
  }, [count, isPaused])

  useEffect(() => {
    if (isPaused || count <= 0) return

    const tick = () => {
      const endAtMs = endAtMsRef.current
      if (endAtMs == null) return

      const remainingSeconds = Math.max(0, Math.ceil((endAtMs - Date.now()) / 1000))
      setCount(remainingSeconds)
    }

    tick()
    const intervalId = window.setInterval(tick, 250)

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        tick()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      window.clearInterval(intervalId)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [count, isPaused])

  useEffect(() => {
    if (count === 0 && !isPaused) {
      onAutoPause()
    }
  }, [count, isPaused, onAutoPause])

  return (
    <div className="relative w-[64px] overflow-hidden text-3xl font-light whitespace-nowrap">
      <AnimatePresence mode="popLayout" initial={false}>
        {
          formatted.split("").map((char, index) => {
            return (
              <motion.span
                key={`${index}-${char}`}
                className="inline-block tabular-nums"
                initial={{ opacity: 0, y: 10, filter: "blur(2px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(2px)" }}
                transition={{ type: "spring", bounce: 0.35 }}
              >{char}</motion.span>
            )
          })
        }
      </AnimatePresence>
    </div>
  )
}
