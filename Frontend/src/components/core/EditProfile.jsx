import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Trash2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from '../ui/input'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import axios from 'axios'
import { toast } from 'sonner
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form"
import { Link, useNavigate } from 'react-router-dom'
import { Dialog, DialogTrigger, DialogContent, DialogDescription, DialogTitle, DialogHeader, DialogClose, DialogFooter } from '../ui/dialog'
import EditProfileImage from './EditProfileImage'
import { REMOVE_PROFILE_IMAGE_END_POINTS, UPDATE_PROFILE_END_POINTS } from '@/Constants'
import { setUser } from '@/app/features/authSlice'

const EditProfile = () => {

    const user = useSelector((state) => state.auth.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    console.log("user", user)

    const [open, setOpen] = useState(false)
    const [removeDialogOpen, setRemoveDialogOpen] = useState(false)

    const EditProfileSchema = z.object({
        name: z.string().min(2, "Name is required"),
        email: z.string().email("Invalid email"),
        phone: z.string().regex(/^[0-9]{10}$/, "Phone must be 10 digits"),
        gender: z.enum(["Male", "Female", "Other"], {
            required_error: "Gender is required",
        }),
        dob: z.string().min(1, "Date of birth is required"),
        about: z.string().min(10, "About must be at least 10 characters"),
    })

    const form = useForm({
        resolver: zodResolver(EditProfileSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            gender: "",
            dob: "",
            about: "",
        },
        mode: "onChange",
    })

    const onSubmit = async (data) => {
        const originalData = {
            name: user.fullName || "",
            email: user.email || "",
            phone: user.phone?.toString() || "",
            gender: user.additionalDetails?.gender || "Male",
            dob: user.additionalDetails?.dateOfBirth || "",
            about: user.additionalDetails?.about || "",
        }

        const hasChanges = JSON.stringify(data) !== JSON.stringify(originalData)
        if (!hasChanges) {
            toast.info("No changes made")
            return
        }

        const formData = new FormData()
        formData.append("fullName", data.name)
        formData.append("email", data.email)
        formData.append("phone", data.phone)
        formData.append("gender", data.gender)
        formData.append("dateOfBirth", data.dob)
        formData.append("about", data.about)

        await toast.promise(
            axios.patch(
                `${import.meta.env.VITE_BASE_URL}/${UPDATE_PROFILE_END_POINTS}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                }
            ),
            {
                loading: "Updating profile...",
                success: (res) => {
                    const updatedUser = res.data.user
                    dispatch(setUser(updatedUser))
                    form.reset({
                        name: updatedUser.fullName || "",
                        email: updatedUser.email || "",
                        phone: updatedUser.phone?.toString() || "",
                        gender: updatedUser.additionalDetails?.gender || "Male",
                        dob: updatedUser.additionalDetails?.dateOfBirth || "",
                        about: updatedUser.additionalDetails?.about || "",
                    })
                    return "Profile updated successfully!"
                },
                error: "Failed to update profile",
            }
        )
    }



    const HandleRemove = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.patch(
                `${import.meta.env.VITE_BASE_URL}/${REMOVE_PROFILE_IMAGE_END_POINTS}`, {},
                {
                    withCredentials: true,
                }
            )

            console.log(response);
            setOpen(false)
            setRemoveDialogOpen(false)
            form.reset()
        }
        catch (err) {
            console.error("Image upload error", err)
        }
    }

    useEffect(() => {
        if (user) {
            form.reset({
                name: user.fullName || "",
                email: user.email || "",
                phone: user.phone?.toString() || "",
                about: user.additionalDetails.about || "",
                gender: user.additionalDetails.gender || "",
                dob: user.additionalDetails?.dateOfBirth
                    ? new Date(user.additionalDetails.dateOfBirth).toISOString().split("T")[0]
                    : "",
            });
        }
    }, [user]);

    return (
        <div className='p-5'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="">
                    <div className="w-[96%]">
                        <p className="font-semibold text-lg p-1">Edit Profile</p>
                        <div className="flex flex-col gap-5">
                            <Card className='bg-gray-300 border border-gray-400'>
                                <CardContent className='w-full flex gap-5'>

                                    <div className="w-full flex items-center justify-between">
                                        <div className="flex items-center gap-5">
                                            <Avatar className="w-20 h-20">
                                                <AvatarImage src={user.image}></AvatarImage>
                                                <AvatarFallback>CN</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col gap-1">
                                                <p className="font-bold text-xl text-gray-700">Change Profile Picture</p>
                                                <div className="flex gap-2">
                                                    <Dialog open={open} onOpenChange={setOpen}>
                                                        <DialogTrigger>
                                                            <Button type='button' className='bg-gray-500'>Change</Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Are you absolutely sure?</DialogTitle>
                                                                <DialogDescription>
                                                                    This action cannot be undone. This will permanently delete your account
                                                                    and remove your data from our servers.
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <EditProfileImage setOpen={setOpen} />
                                                        </DialogContent>
                                                    </Dialog>
                                                    <Dialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
                                                        <DialogTrigger>
                                                            <Button variant='outline' className='border border-gray-400'>Remove</Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Are you absolutely sure?</DialogTitle>
                                                                <DialogDescription>
                                                                    This action cannot be undone. This will permanently delete your profile image
                                                                    and remove your profile image from our servers.
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <DialogFooter>
                                                                <DialogClose asChild>
                                                                    <Button variant="outline">Cancel</Button>
                                                                </DialogClose>
                                                                <Button type="button" onClick={HandleRemove}>Remove Image</Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className='bg-gray-300 border border-gray-400'>
                                <CardHeader>
                                    <CardTitle className='font-semibold text-xl text-gray-800'>Profile Information</CardTitle>
                                </CardHeader>
                                <CardContent className='w-full flex gap-5'>
                                    <div className="w-1/2 flex flex-col gap-5">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Full Name</FormLabel>
                                                    <FormControl className="bg-gray-200">
                                                        <Input placeholder="Write a job description..." {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl className="bg-gray-200">
                                                        <Input type="email" placeholder="you@example.com" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="phone"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Phone</FormLabel>
                                                    <FormControl className="bg-gray-200">
                                                        <Input type="tel" placeholder="9876543210" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="w-1/2 flex flex-col gap-5">
                                        <FormField
                                            control={form.control}
                                            name="about"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>About</FormLabel>
                                                    <FormControl className="bg-gray-200">
                                                        <Input placeholder="Tell us about yourself..." {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="dob"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Date of Birth</FormLabel>
                                                    <FormControl className="bg-gray-200">
                                                        <Input type="date" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="gender"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Gender</FormLabel>
                                                    <FormControl className="bg-gray-200 p-[0.65rem] rounded-md">
                                                        <RadioGroup
                                                            onValueChange={field.onChange}
                                                            value={field.value}
                                                            className="flex gap-4"
                                                        >
                                                            <FormItem className="flex items-center space-x-2">
                                                                <FormControl>
                                                                    <RadioGroupItem value="Male" />
                                                                </FormControl>
                                                                <FormLabel className="font-normal">Male</FormLabel>
                                                            </FormItem>
                                                            <FormItem className="flex items-center space-x-2">
                                                                <FormControl>
                                                                    <RadioGroupItem value="Female" />
                                                                </FormControl>
                                                                <FormLabel className="font-normal">Female</FormLabel>
                                                            </FormItem>
                                                            <FormItem className="flex items-center space-x-2">
                                                                <FormControl>
                                                                    <RadioGroupItem value="Other" />
                                                                </FormControl>
                                                                <FormLabel className="font-normal">Other</FormLabel>
                                                            </FormItem>
                                                        </RadioGroup>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                            {/* <Card className='bg-gray-300 border border-gray-400'>
                                    <CardHeader>
                                        <CardTitle className='font-semibold text-xl text-gray-800'>Password</CardTitle>
                                        <CardContent className='w-full flex gap-5 p-0'>
                                            <div className="w-1/2">
                                                <FormField
                                                    control={form.control}
                                                    name="currentpassword"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Current Password</FormLabel>
                                                            <FormControl className="bg-gray-200">
                                                                <Input placeholder="Write a job description..." {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className='w-1/2'>
                                                <FormField
                                                    control={form.control}
                                                    name="newpassword"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Change Password</FormLabel>
                                                            <FormControl className="bg-gray-200">
                                                                <Input placeholder="Write a job description..." {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </CardContent>
                                    </CardHeader>
                                </Card>
                                <Card className='bg-rose-950 border border-red-500'>
                                    <CardContent>
                                        <div className="flex gap-4">
                                            <div type='button' className='w-fit h-fit rounded-full bg-red-900 text-red-400 p-2'><Trash2 className='w-5 h-5' /></div>
                                            <div className="flex flex-col gap-2">
                                                <p className="text-gray-100 font-semibold text-xl">Delete Account</p>
                                                <div className="">
                                                    <p className="text-gray-100 text-sm font-light">Would you like to delete account?</p>
                                                    <Link to="">
                                                    <p className="text-sm italic font-medium text-red-600">I want to delete my account</p>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card> */}
                            <div className="flex gap-2 justify-end">
                                <Button type="button" onClick={() => navigate("/dashboard/profile")} variant="outline">Cancel</Button>
                                <Button type='submit' className="bg-gray-500 text-gray-100 border border-gray-600">Save</Button>
                            </div>
                        </div>
                    </div >
                </form>
            </Form>
        </div >
    )
}

export default EditProfile
