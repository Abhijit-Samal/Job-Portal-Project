import React, { useState } from 'react'
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form"
import axios from 'axios'
import { toast } from 'sonner'
import { CloudUpload, X } from 'lucide-react'
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from '../ui/button'
import { DialogClose } from '@radix-ui/react-dialog'
import { useNavigate } from 'react-router-dom'
import { UPDATE_PROFILE_IMAGE_END_POINTS } from '@/Constants'
import { useDispatch } from 'react-redux'
import { updateUser } from '@/app/features/authSlice'

const EditProfileImage = ({ setOpen }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [imagePreview, setImagePreview] = useState(null)

    const EditProfileSchema = z.object({
        image: z
            .any()
            .refine((file) => file instanceof File && file.size > 0, "Image is required"),
    })

    const form = useForm({
        resolver: zodResolver(EditProfileSchema),
    })

    const onSubmit = async (data) => {
    const formData = new FormData()
    formData.append("image", data.image)

    await toast.promise(
        axios.patch(
            `${import.meta.env.VITE_BASE_URL}/${UPDATE_PROFILE_IMAGE_END_POINTS}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            }
        ),
        {
            loading: "Updating profile image...",
            success: (res) => {
                dispatch(updateUser({ image: res.data.image }))
                setOpen(false)
                form.reset()
                setImagePreview(null)
                return "Profile image updated!"
            },
            error: "Failed to update image",
        }
    )
}
    return (
        <div>
            <Form {...form}>
                <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Profile Image</FormLabel>
                            <FormControl>
                                <div className="relative w-full max-w-xl aspect-video border border-dashed border-gray-300 rounded-md overflow-hidden cursor-pointer hover:bg-gray-50 transition">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0]
                                            if (file) {
                                                field.onChange(file)
                                                const url = URL.createObjectURL(file)
                                                setImagePreview(url)
                                            }
                                            e.target.value = ""
                                        }}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    {imagePreview ? (
                                        <>
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="absolute inset-0 w-full h-full object-cover cursor-default"
                                            />
                                            <div
                                                className="w-fit absolute top-1 right-1 border-[2px] text-white bg-black p-1 rounded-full"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    field.onChange(undefined)
                                                    setImagePreview(null)
                                                }}
                                            >
                                                <X className="w-4 h-4" />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center w-full h-full text-gray-500">
                                            <CloudUpload />
                                            <span className="text-sm">Click to upload image</span>
                                        </div>
                                    )}
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="w-full flex justify-end mt-5 gap-2">
                    <DialogClose asChild>
                        <Button type='button' variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="button" disabled={form.formState.isSubmitting} onClick={form.handleSubmit(onSubmit)}>
                        {form.formState.isSubmitting ? "Updating..." : "Update"}
                    </Button>
                </div>
            </Form>
        </div>
    )
}

export default EditProfileImage
