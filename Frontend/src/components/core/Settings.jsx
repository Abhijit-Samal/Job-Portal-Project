import React from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import axios from 'axios'
import { toast } from "sonner"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { CloudUpload, Edit, X } from 'lucide-react'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'
import { UPDATE_RESUME_END_POINTS } from '@/Constants'
import { setUser } from '@/app/features/authSlice'

const Settings = () => {
  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch();
  const [imagePreview, setImagePreview] = useState(user?.additionalDetails?.resume || null)

  const ResumeSchema = z.object({
    resume: z
      .any()
      .refine((file) => file instanceof File || file === undefined, {
        message: "Invalid file",
      }),
  });
  const form = useForm({
    resolver: zodResolver(ResumeSchema),
  })
  const onSubmit = async (data) => {
    const formData = new FormData();
    if (data.resume instanceof File) {
      formData.append("resume", data.resume);
    }

    await toast.promise(
      axios.patch(`${import.meta.env.VITE_BASE_URL}/${UPDATE_RESUME_END_POINTS}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }),
      {
        loading: "Uploading resume...",
        success: (res) => {
          dispatch(setUser(res.data.user));
          return "Resume uploaded successfully!";
        },
        error: (err) => {
          console.error(err);
          return err?.response?.data?.message || "Upload failed. Please try again.";
        },
      }
    );
  };


  return (
    <div className='p-5'>
      <div className="w-[96%]">
        <p className="font-semibold text-lg p-1">Settings</p>
        <div className="flex flex-col gap-5">
          <Card className='bg-gray-300 border border-gray-400'>
            <CardContent className='w-full flex gap-5'>

              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={user?.image}></AvatarImage>
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="">
                    <p className="font-bold text-xl">{user.fullName}</p>
                    <p className="">{user.email}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className='bg-gray-300 border border-gray-400'>
            <CardHeader>
              <CardTitle className='font-semibold text-xl text-gray-800'>Personal Details</CardTitle>
            </CardHeader>
            <CardContent className='w-full flex justify-between'>
              <div className="flex flex-col gap-5">
                <div className="">
                  <p className="text-gray-500 font-medium text-lg">Full Name</p>
                  <p className="font-medium text-lg">{user.fullName}</p>
                </div>
                <div className="">
                  <p className="text-gray-500 font-medium text-lg">Email</p>
                  <p className="font-medium text-lg">{user.email}</p>
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <div className="">
                  <p className="text-gray-500 font-medium text-lg">Phone Number</p>
                  <p className="font-medium text-lg">(+91) {user.phone}</p>
                </div>
                <div className="">
                  <p className="text-gray-500 font-medium text-lg">Role</p>
                  <p className="font-medium text-lg">{user.role}</p>
                </div>
              </div>
              <div className="">
                <Link to="/dashboard/profile/editprofile">
                  <Button variant='outline' className='border border-gray-400'><Edit /> Edit</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          {user.role === "Student" && (
            <Card className="bg-gray-300 border border-gray-400">
              <CardHeader>
                <CardTitle className="font-semibold text-xl text-gray-800">Resume</CardTitle>
              </CardHeader>
              <CardContent className="">
                <Form {...form}>
                  <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                      control={form.control}
                      name="resume"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{`${imagePreview !== null ? "Resume.pdf" : "Upload Resume"}`}</FormLabel>
                          <FormControl>
                            <div className="relative w-full max-w-2xl aspect-video border border-dashed border-gray-500 rounded-md overflow-hidden cursor-pointer hover:bg-gray-50 transition">
                              <input
                                type="file"
                                accept="application/pdf"
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
                                  <iframe
                                    src={imagePreview}
                                    alt="Preview"
                                    allow="fullscreen"
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
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting ? "Saving..." : "Save"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  )
}

export default Settings