import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import * as thumbhash from "thumbhash"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const binaryToBase64 = (thumbhash: Uint8Array) => btoa(String.fromCharCode(...thumbhash));
export const base64ToBinary = (thumbhashBase64: string) => Uint8Array.from(atob(thumbhashBase64), c => c.charCodeAt(0));
export const base64ToDataURL = (base64: string) => {
  const binary = base64ToBinary(base64);
  return thumbhash.thumbHashToDataURL(binary);
}