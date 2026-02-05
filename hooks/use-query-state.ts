import { useQueryState } from "nuqs"

export const useEditPhotoId = () => {
    return useQueryState("edit-photo-id", { shallow: true })
} 