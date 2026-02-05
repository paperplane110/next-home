import { PhotoQuery } from "@/drizzle/schema";
import { atom } from "jotai"

/**
 * Dialog atoms
 */
export const photoUploadDialogOpenAtom = atom(false);
export const photoEditDialogOpenAtom = atom(false);
export const todayEditDialogOpenAtom = atom(false);

/**
 * photo atom
 */
export const photoAtom = atom<PhotoQuery[]>([]);

export type TagOption = {
    value: string;
    label: string;
}
export const tagOptionsAtom = atom<TagOption[]>([]);
