import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const binaryToBase64 = (thumbhash: Uint8Array) => btoa(String.fromCharCode(...thumbhash));
export const base64ToBinary = (thumbhashBase64: string) => Uint8Array.from(atob(thumbhashBase64), c => c.charCodeAt(0));
