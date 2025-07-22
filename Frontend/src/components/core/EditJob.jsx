import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Trash2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from '../ui/input'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import axios from 'axios'
import { toast } from 'sonner'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form"
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Dialog, DialogTrigger, DialogContent, DialogDescription, DialogTitle, DialogHeader, DialogClose, DialogFooter } from '../ui/dialog'
import EditProfileImage from './EditProfileImage'
import { REMOVE_PROFILE_IMAGE_END_POINTS, UPDATE_PROFILE_END_POINTS } from '@/Constants'
import { setUser } from '@/app/features/authSlice'
import EditJobImage from './EditJobImage'
import { updateFullJob } from '@/app/features/jobSlice'

const EditJob = () => {


    const jobs = useSelector((state) => state.jobs.jobs);
    console.log("jobs", jobs)

    const { jobId } = useParams();

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const job = jobs.find(job => job._id === jobId);


    const [open, setOpen] = useState(false)
    const [removeDialogOpen, setRemoveDialogOpen] = useState(false)

    const jobTypes = ["Full-time", "Part-time", "Contract", "Internship", "Freelance", "Temporary"]
    const categories = ["Software Development", "Design", "Marketing", "Sales", "Finance", "Healthcare", "Education", "Construction"]
    const locations = ["Remote", "Bangalore", "Mumbai", "Hyderabad", "Delhi", "Chennai", "Pune", "Kolkata"]
    const salaryRanges = ["2-4 LPA", "4-6 LPA", "6-8 LPA", "8-10 LPA", "10-15 LPA", "15+ LPA"]
    const experienceLevels = ["Fresher", "0-1 Years", "1-3 Years", "3-5 Years", "5-10 Years", "10+ Years"]
    const statusOptions = ["Draft", "Published"];



    const EditJobSchema = z.object({
        jobTitle: z.string().min(3, "Job Title is required"),
        jobDescription: z.string().min(10, "Job Description is required"),
        jobType: z.string().min(2, "Job Type is required"),
        category: z.string().min(2, "Category is required"),
        location: z.string().min(2, "Location is required"),
        salary: z.string().regex(/^\d+(\.\d+)?(-\d+(\.\d+)?)?\s?(LPA|lpa)?$/, "Format should be like 6-10 LPA"),
        status: z.string().min(2, "Status is required"),
        experience: z.string().min(1, "Experience is required"),
    });


    const form = useForm({
        resolver: zodResolver(EditJobSchema),
        defaultValues: {
            jobTitle: job.jobTitle,
            jobDescription: job.jobDescription,
            status: job.status,
            jobType: job.Details?.jobType || "",
            category: job.Details?.category || "",
            location: job.Details?.location || "",
            salary: job.Details?.salary || "",
            experience: job.Details?.experience || "",
        },
        mode: "onChange",
    });


    const onSubmit = async (data) => {
        const originalData = {
            jobTitle: job.jobTitle || "",
            jobDescription: job.jobDescription || "",
            jobType: job.Details.jobType || "",
            category: job.Details.category || "",
            location: job.Details.location || "",
            salary: job.Details.salary || "",
            status: job.status || "",
            experience: job.Details.experience || "",
        };

        const hasChanges = JSON.stringify(data) !== JSON.stringify(originalData);

        if (!hasChanges) {
            toast.info("No changes made to the job.");
            return;
        }

        const formData = new FormData();
        formData.append("jobTitle", data.jobTitle);
        formData.append("jobDescription", data.jobDescription);
        formData.append("status", data.status);
        formData.append("category", data.category);
        formData.append("jobType", data.jobType);
        formData.append("location", data.location);
        formData.append("salary", data.salary);
        formData.append("experience", data.experience);

        await toast.promise(
            axios.patch(
                `${import.meta.env.VITE_BASE_URL}/jobs/editJob/${jobId}`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            ),
            {
                loading: "Updating job...",
                success: (res) => {
                    dispatch(updateFullJob(res.data.job));
                    return "Job updated successfully!";
                },
                error: "Failed to update job.",
            }
        );
    };





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
        if (job?._id) {
            form.reset({
                jobTitle: job.jobTitle,
                jobDescription: job.jobDescription,
                status: job.status,
                jobType: job.Details?.jobType || "",
                category: job.Details?.category || "",
                location: job.Details?.location || "",
                salary: job.Details?.salary || "",
                experience: job.Details?.experience || "",
            });
        }
    }, [job?._id]);



    return (
        <div className='p-5'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="">
                    <div className="w-[96%]">
                        <p className="font-semibold text-lg p-1">Edit Job</p>
                        <div className="flex flex-col gap-5">
                            <Card className='bg-gray-300 border border-gray-400'>
                                <CardContent className='w-full flex gap-5'>

                                    <div className="w-full flex items-center justify-between">
                                        <div className="flex items-center gap-5">
                                            <Avatar className="w-20 h-20">
                                                <AvatarImage src={job?.Details?.image}></AvatarImage>
                                                <AvatarFallback>CN</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col gap-1">
                                                <p className="font-bold text-xl text-gray-700">Change Job Image</p>
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
                                                            <EditJobImage setOpen={setOpen} jobId={jobId} />
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
                                    <CardTitle className='font-semibold text-xl text-gray-800'>Job Details</CardTitle>
                                </CardHeader>
                                <CardContent className='w-full flex gap-5'>
                                    <div className="w-1/2 flex flex-col gap-5">
                                        <FormField
                                            control={form.control}
                                            name="jobTitle"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>job Title</FormLabel>
                                                    <FormControl className="bg-gray-200">
                                                        <Input placeholder="Write a job description..." {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="jobDescription"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Job Description</FormLabel>
                                                    <FormControl className="bg-gray-200">
                                                        <Input placeholder="you@example.com" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <Controller
                                            control={form.control}
                                            name="location"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Location</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value || ""}>
                                                        <FormControl className="bg-gray-200">
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Select Location" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {locations.map((loc) => (
                                                                <SelectItem key={loc} value={loc}>
                                                                    {loc}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="jobType"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Job Type</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value || ""}>
                                                        <FormControl className="bg-gray-200">
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Select Job Type" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {jobTypes.map((type) => (
                                                                <SelectItem key={type} value={type}>
                                                                    {type}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="w-1/2 flex flex-col gap-5">
                                        <FormField
                                            control={form.control}
                                            name="category"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Category</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value || ""}>
                                                        <FormControl className="bg-gray-200">
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Select Category" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {categories.map((cat) => (
                                                                <SelectItem key={cat} value={cat}>
                                                                    {cat}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="salary"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Salary</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value || ""}>
                                                        <FormControl className="bg-gray-200">
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Select Salary Range" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {salaryRanges.map((range) => (
                                                                <SelectItem key={range} value={range}>
                                                                    {range}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="experience"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Experience</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value || ""}>
                                                        <FormControl className="bg-gray-200">
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Select Experience" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {experienceLevels.map((exp) => (
                                                                <SelectItem key={exp} value={exp}>
                                                                    {exp}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Controller
                                            control={form.control}
                                            name="status"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>status</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value || ""}>
                                                        <FormControl className="bg-gray-200">
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Select Status" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {statusOptions.map((status) => (
                                                                <SelectItem key={status} value={status}>
                                                                    {status}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
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

export default EditJob