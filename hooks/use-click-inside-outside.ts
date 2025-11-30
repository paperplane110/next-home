import { useEffect, RefObject } from "react";

/**
 * 监听元素外部的点击事件。
 * @param {object} ref - 指向目标 DOM 元素的 React ref 对象。
 * @param {function} insideHandler - 当点击发生在元素内部时执行的回调函数。
 * @param {function} outsideHandler - 当点击发生在外部时执行的回调函数。
 */
export function useClickInsideOutside(
  ref: RefObject<HTMLElement | null>,
  insideHandler: (event: MouseEvent | TouchEvent) => void,
  outsideHandler: (event: MouseEvent | TouchEvent) => void
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current) {
        return;
      }
      if (ref.current.contains(event.target as Node)) {
        insideHandler(event);
        return;
      }
      outsideHandler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, insideHandler, outsideHandler]);
}
