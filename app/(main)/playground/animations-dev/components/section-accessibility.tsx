"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCcwIcon } from "lucide-react"
import { useMeasure } from "react-use"
import { useMemo } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { motion, AnimatePresence, MotionConfig, useReducedMotion } from "motion/react"

export function SectionAccessibility() {
  return (
    <div className="subsection mt-32">
      <div className="font-bold text-2xl">
        <div>
          <h2>Accessibility</h2>
        </div>
      </div>
      <div className="csc mt-8">
        <MultiStepComponent />
      </div>
    </div>
  )
}


type Direction = 1 | -1

function MultiStepComponent() {
  const [currentStep, setCurrentStep] = useState(0);
  const [ref, bounds] = useMeasure<HTMLDivElement>();

  const [direction, setDirection] = useState<Direction>(1);

  const isReducedMotion = useReducedMotion();

  const variants = {
    initial: (direction: Direction) => {
      return { x: `${110 * direction}%`, opacity: 0 };
    },
    active: { x: "0%", opacity: 1 },
    exit: (direction: Direction) => {
      return { x: `${-110 * direction}%`, opacity: 0 };
    },
  };

  const reduceMotionVariants = {
    initial: { opacity: 0 },
    active: { opacity: 1 },
    exit: { opacity: 0 },
  }

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
        animate={isReducedMotion ? {} : { height: bounds.height + 48 }}
      >
        <div key="inner" ref={ref}>
          <AnimatePresence mode="popLayout" initial={false} custom={direction}>
            <motion.div
              key={`step-${currentStep}`}
              custom={direction}
              variants={isReducedMotion ? reduceMotionVariants : variants}
              initial="initial"
              animate="active"
              exit="exit"
              transition={{ duration: 0.3, type: "spring", bounce: 0 }}
            >
              {content}
            </motion.div>
          </AnimatePresence>
          <motion.div layout={!isReducedMotion} layoutId="actions" className="flex justify-between mt-8">
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
