"use client"
import { useState } from "react";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PhotoEditForm, PhotoEditFormSchema, PhotoQuery } from "@/drizzle/schema"
import { updatePhotoAction } from "@/feature/photo/actions";
import { tagOptionsAtom } from "@/lib/atoms";

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { MultiSelect } from "@/components/ui/multi-select"
import Image from "next/image"
import { toast } from "sonner"
import { useAtom } from "jotai";


export function EditImageForm({
  photo,
  onSuccess,
}: {
  photo: PhotoQuery
  onSuccess?: (photo: PhotoQuery) => void
}) {
  const [tagOptions] = useAtom(tagOptionsAtom)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<PhotoEditForm>({
    resolver: zodResolver(PhotoEditFormSchema),
    defaultValues: {
      title: photo.title,
      description: photo.description,
      capturedAt: photo.capturedAt,
      creator: photo.creator,
      location: photo.location,
      tags: photo.tags,
    },
  })

  const onSubmit = (data: PhotoEditForm) => {
    setIsSubmitting(true)
    updatePhotoAction(
      photo.id,
      data,
    ).then((res) => {
      setIsSubmitting(false)
      if (res.success) {
        toast.success("Photo updated", {
          description: "Your photo has been updated successfully.",
        })
        onSuccess?.(res.data)
      } else {
        toast.error(res.data)
      }
    }).catch(() => {
      setIsSubmitting(false)
      toast.error("An error occurred. Please try again.")
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div id="image-preview" className="flex items-center justify-center">
          <Image
            width={640 * Number(photo.aspectRatio)}
            height={640}
            src={photo.url}
            alt={photo.title}
            className="w-auto max-h-64 max-w-96 rounded-lg object-contain"
            placeholder="empty"
          />
        </div>
        <div className="mt-4 flex flex-col gap-4 px-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="capturedAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Captured At</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="creator"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Creator</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ''}
                    placeholder="please enter the creator"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <MultiSelect
                    defaultValue={field.value}
                    value={field.value ?? []}
                    disabled={field.disabled}
                    name={field.name}
                    ref={field.ref}
                    options={tagOptions}
                    onValueChange={field.onChange}
                    placeholder="e.g. nature, sunset"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ''}
                    placeholder="e.g. New York, USA"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ''}
                    placeholder="e.g. A beautiful sunset in New York"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>
        <div className="mt-8 px-4">
          <Button
            disabled={isSubmitting}
            type="submit"
            className="w-full"
          >
            {isSubmitting ? (
              <p>
                Saving...
              </p>
            ) : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  )
}