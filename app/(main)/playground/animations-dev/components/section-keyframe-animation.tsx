"use client"
import { useState } from "react";
import { CoinIcon } from "./coin-icon"

export default function SectionKeyframeAnimation() {
  const [coinRotation, setCoinRotation] = useState(70);
  const [isBackfaceHidden, setIsBackfaceHidden] = useState(false);
  const [coinParts, setCoinParts] = useState({
    face: true,
    faceInner: true,
    side: true,
    backInner: true,
    back: true,
  });

  return (
    <div className="subsection mt-32">
      <h2 className="font-bold text-2xl">
        <div className="flex items-center">
          <div className="size-4 rounded-full border-amber-400 border-dashed border-3 ring-background ring-3"/>
          <div className="-ml-0.5 size-4 rounded-full border-amber-400 border-dashed border-3 ring-background ring-3"/>
          <div className="-ml-0.5 size-4 rounded-full border-amber-400 border-3 ring-background ring-3"/>
        </div>
        Keyframe Animations
      </h2>
      <h3 className="mt-8 font-bold">Coin Icon</h3>
      <p className="mt-4 space-y-6 [&>p+ol]:-mt-4 text-base text-muted-foreground">
        A coin icon with animation.
      </p>
      <div
        id="container"
        className="relative mt-8 h-60 w-full bg-white border border-dashed border-gray-300 rounded-4xl flex flex-col items-center justify-center"
      >
        <div
          className="relative size-[56px] animation-rotate transform-3d perspective-distant"
        >
          <div id="coin-side" className="absolute bg-[#ffaa04] w-[8px] h-[56px] translate-x-[28px] rotate-y-90" />
          <CoinIcon className="absolute translate-z-1 backface-hidden" />
          <div id="coin-face-inner" className="absolute bg-[#ffaa04] w-[56px] h-[56px] rounded-full rotate-y-180 translate-z-1 backface-hidden" />
          <CoinIcon className="absolute -translate-z-1 rotate-y-180 backface-hidden" />
          <div id="coin-back-inner" className="absolute bg-[#ffaa04] w-[56px] h-[56px] rounded-full -translate-z-1 backface-hidden" />
        </div>
        <style jsx>{`
            @keyframes coin-icon-rotate {
              0% {
                transform: rotateY(0deg);
              }
              100% {
                transform: rotateY(360deg);
              }
            }
            .animation-rotate {
              animation-name: coin-icon-rotate;
              animation-duration: 2s;
              animation-iteration-count: infinite;
              animation-timing-function: linear;
            }
          `}</style>
      </div>
      <div className="mt-16">
        <p className="cp">
          The <code>coin</code> consists of <b>five</b> parts: coin face, coin face inner, coin side, coin back inner, and coin back.
        </p>
        <p className="cp">A key point is that each round shape has the property <code>backface-hidden</code> to hide the back side when it is rotated.</p>
        <div
          id="container"
          className="relative mt-8 h-80 w-full bg-white border border-dashed border-gray-300 rounded-4xl flex flex-col items-center"
        >
          <div className="my-20 relative size-[56px] transform-3d" style={{ transform: `rotateY(${coinRotation}deg)` }}>
            {coinParts.side && (
              <div id="coin-side" className="absolute bg-[#ffaa04] w-[8px] h-[56px] translate-x-[28px] rotate-y-90" />
            )}
            {coinParts.face && <CoinIcon className={`absolute translate-z-5 ${isBackfaceHidden ? "backface-hidden" : ""}`} />}
            {coinParts.faceInner && (
              <div id="coin-face-inner" className={`absolute bg-[#ffaa04] w-[56px] h-[56px] rounded-full rotate-y-180 translate-z-3 ${isBackfaceHidden ? "backface-hidden" : ""}`} />
            )}
            {coinParts.back && <CoinIcon className={`absolute -translate-z-5 rotate-y-180 ${isBackfaceHidden ? "backface-hidden" : ""}`} />}
            {coinParts.backInner && (
              <div id="coin-back-inner" className={`absolute bg-[#ffaa04] w-[56px] h-[56px] rounded-full -translate-z-3 ${isBackfaceHidden ? "backface-hidden" : ""}`} />
            )}
          </div>
          <style jsx>{`
            @keyframes coin-icon-rotate {
              0% {
                transform: rotateY(0deg);
              }
              100% {
                transform: rotateY(360deg);
              }
            }
            .animation-rotate {
              animation-name: coin-icon-rotate;
              animation-duration: 5s;
              animation-iteration-count: infinite;
              animation-timing-function: linear;
            }
          `}</style>

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={coinParts.face}
                  onChange={(e) => setCoinParts((prev) => ({ ...prev, face: e.target.checked }))}
                />
                <span>face</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={coinParts.faceInner}
                  onChange={(e) => setCoinParts((prev) => ({ ...prev, faceInner: e.target.checked }))}
                />
                <span>face inner</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={coinParts.side}
                  onChange={(e) => setCoinParts((prev) => ({ ...prev, side: e.target.checked }))}
                />
                <span>side</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={coinParts.backInner}
                  onChange={(e) => setCoinParts((prev) => ({ ...prev, backInner: e.target.checked }))}
                />
                <span>back inner</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={coinParts.back}
                  onChange={(e) => setCoinParts((prev) => ({ ...prev, back: e.target.checked }))}
                />
                <span>back</span>
              </label>
            </div>

            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="font-mono text-xs w-14">{coinRotation}°</span>
              <input
                aria-label="coin rotation"
                type="range"
                min={0}
                max={360}
                step={1}
                value={coinRotation}
                onChange={(e) => setCoinRotation(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isBackfaceHidden}
                  onChange={(e) => setIsBackfaceHidden(e.target.checked)}
                />
                <span>backface-hidden</span>
              </label>
          </div>

        </div>
      </div>
    </div>)
}
