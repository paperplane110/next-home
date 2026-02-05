"use client"
import { useHydrateAtoms } from "jotai/utils"
import { tagOptionsAtom, type TagOption } from "@/lib/atoms"

type HydrateAtomsProps = {
    tagOptions: TagOption[],
    children: React.ReactNode
}

export function HydrateAtoms({ tagOptions, children }: HydrateAtomsProps) {
    useHydrateAtoms([[tagOptionsAtom, tagOptions]])
    return children
}
