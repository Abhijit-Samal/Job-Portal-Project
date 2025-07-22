import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CREATE_JOB_END_POINT } from "@/Constants"
import { useState } from "react"
import { CloudUpload, X } from "lucide-react"
import axios from "axios"
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { addJob } from "@/app/features/jobSlice"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
const jobSchema = z.object({
    jobTitle: z
        .string()
        .min(3, "Job title must be at least 3 characters")
        .max(100, "Job title must be under 100 characters"),

    jobDescription: z
        .string()
        .min(10, "Job description must be at least 10 characters"),

    keyResponsibilities: z
        .array(z.string().min(1, "Responsibility cannot be empty"))
        .min(1, "At least one responsibility is required"),

    jobType: z
        .string()
        .min(1, "Job type is required"),

    category: z
        .string()
        .min(1, "Category is required"),

    experience: z
        .string()
        .min(1, "Experience is required"),

    salary: z
        .string()
        .min(1, "Salary is required"),

    location: z
        .string()
        .min(1, "Location is required"),

    image: z
        .any()
        .refine((file) => file instanceof File || (file && typeof file === "object"), {
            message: "Image is required",
        }),
})

export default function CreateJob() {



    const dispatch = useDispatch();

    const [tab, setTab] = useState("overview")
    const [newResponsibility, setNewResponsibility] = useState("")
    const [imagePreview, setImagePreview] = useState(null)

    const navigate = useNavigate()

    const form = useForm({
        resolver: zodResolver(jobSchema),
        defaultValues: {
            jobTitle: "",
            jobDescription: "",
            keyResponsibilities: [],
            jobType: "",
            category: "",
            experience: "",
            salary: "",
            location: "",
            image: undefined,
        },
        mode: "onChange",
    })

    const jobTypes = ["Full-time", "Part-time", "Contract", "Internship", "Freelance", "Temporary"]
    const categories = ["Software Development", "Design", "Marketing", "Sales", "Finance", "Healthcare", "Education", "Construction"]
    const locations = ["Remote", "Bangalore", "Mumbai", "Hyderabad", "Delhi", "Chennai", "Pune", "Kolkata"]
    const salaryRanges = ["2-4 LPA", "4-6 LPA", "6-8 LPA", "8-10 LPA", "10-15 LPA", "15+ LPA"]
    const experienceLevels = ["Fresher", "0-1 Years", "1-3 Years", "3-5 Years", "5-10 Years", "10+ Years"]
    const statusOptions = ["Draft", "Published"];

    const onSubmit = async (data) => {
        const formData = new FormData();

        formData.append("jobTitle", data.jobTitle);
        formData.append("jobDescription", data.jobDescription);
        formData.append("jobType", data.jobType);
        formData.append("category", data.category);
        formData.append("experience", data.experience);
        formData.append("salary", data.salary);
        formData.append("location", data.location);
        formData.append("keyResponsibilities", JSON.stringify(data.keyResponsibilities));

        if (data.image instanceof File) {
            formData.append("image", data.image);
        }

        await toast.promise(
            axios.post(`${import.meta.env.VITE_BASE_URL}/${CREATE_JOB_END_POINT}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            }),
            {
                loading: "Creating job...",
                success: (res) => {
                    dispatch(addJob(res.data.job));
                    navigate("/dashboard/jobs/created");
                    form.reset();
                    setImagePreview(null);
                    return "Job created successfully!";
                },
                error: "Failed to create job.",
            }
        );
    };



    const addResponsibility = () => {
        if (newResponsibility.trim() !== "") {
            const updated = [...form.getValues("keyResponsibilities"), newResponsibility]
            form.setValue("keyResponsibilities", updated, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true
            })
            setNewResponsibility("")
        }
    }

    const removeResponsibility = (index) => {
        const updated = form.getValues("keyResponsibilities").filter((_, i) => i !== index)

        form.setValue("keyResponsibilities", updated, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
        })
    }

    const validateStep = async (fields) => {
        const result = await form.trigger(fields)
        return result
    }

    const values = form.getValues()

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-md mx-auto">
                <Tabs value={tab} onValueChange={setTab} className="w-full flex justify-self-center">
                    <TabsList>
                        <TabsTrigger value="overview">Job Overview</TabsTrigger>
                        <TabsTrigger value="responsiblities">Job Responsibilities</TabsTrigger>
                        <TabsTrigger value="details">Job Details</TabsTrigger>
                        <TabsTrigger value="preview">Preview</TabsTrigger>

                    </TabsList>

                    <TabsContent value="overview">
                        <Card>
                            <CardHeader>
                                <CardTitle>Job Overview</CardTitle>
                                <CardDescription>Fill out basic job info</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-5">
                                <FormField
                                    control={form.control}
                                    name="jobTitle"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Job Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Microsoft" {...field} />
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
                                            <FormControl>
                                                <Input placeholder="Write a job description..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Job Image</FormLabel>
                                            <FormControl>
                                                <div className="relative w-full max-w-md aspect-video border border-dashed border-gray-300 rounded-md overflow-hidden cursor-pointer hover:bg-gray-50 transition">
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
                            </CardContent>
                            <CardFooter>
                                <Button
                                    type="button"
                                    onClick={async () => {
                                        const valid = await validateStep(["jobTitle", "jobDescription", "image"])
                                        if (valid) setTab("responsiblities")
                                    }}
                                >
                                    Next
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="responsiblities">
                        <Card>
                            <CardHeader>
                                <CardTitle>Responsibilities</CardTitle>
                                <CardDescription>Add key responsibilities</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-5">
                                <FormItem>
                                    <FormLabel>New Responsibility</FormLabel>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Add a responsibility"
                                            value={newResponsibility}
                                            onChange={(e) => setNewResponsibility(e.target.value)}
                                        />
                                        <Button type="button" onClick={addResponsibility}>Add</Button>
                                    </div>
                                </FormItem>

                                <ul className="flex flex-col gap-2">
                                    {form.watch("keyResponsibilities").map((resp, index) => (
                                        <li key={index} className="flex items-center justify-between bg-gray-300 p-1 pl-3 rounded-md">
                                            <span>{resp}</span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeResponsibility(index)}
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </li>
                                    ))}
                                </ul>

                                <FormField
                                    control={form.control}
                                    name="keyResponsibilities"
                                    render={() => <FormMessage />}
                                />
                            </CardContent>
                            <CardFooter className='flex gap-2'>
                                <Button type="button" variant='outline' onClick={() => setTab("overview")}>Previous</Button>
                                <Button type="button" onClick={async () => {
                                    const valid = await validateStep(["keyResponsibilities"])
                                    if (valid) setTab("details")
                                }}>Next</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="details">
                        <Card>
                            <CardHeader>
                                <CardTitle>Job Details</CardTitle>
                                <CardDescription>Provide additional job information</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-5">
                                <FormField
                                    control={form.control}
                                    name="jobType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Job Type</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl className="bg-gray-200">
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select job type" />
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

                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Job Category</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl className="bg-gray-200">
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select category" />
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
                                    name="experience"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Experience Level</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl className="bg-gray-200">
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select experience level" />
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

                                <FormField
                                    control={form.control}
                                    name="salary"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Salary Range</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl className="bg-gray-200">
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select salary range" />
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
                                    name="location"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Location</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl className="bg-gray-200">
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select location" />
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
                            </CardContent>
                            <CardFooter className='flex gap-2'>
                                <Button type="button" variant='outline' onClick={() => setTab("responsiblities")}>Previous</Button>
                                <Button type="button" onClick={async () => {
                                    const valid = await validateStep(["details"])
                                    if (valid) setTab("preview")
                                }}>Next</Button>
                                {/* <Button type="submit" className="w-fit" disabled={form.formState.isSubmitting}>
                                    {form.formState.isSubmitting ? "Creating..." : "Create Job"} */}
                                {/* </Button> */}
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="preview">
                        <Card>
                            <CardHeader>
                                <CardTitle>Preview Job Information</CardTitle>
                                <CardDescription>Review all your job details before submission</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div><strong>Title:</strong> {values.jobTitle}</div>
                                <div><strong>Description:</strong> {values.jobDescription}</div>
                                <div><strong>Responsibilities:</strong> {values.keyResponsibilities?.join(", ")}</div>
                                <div><strong>Type:</strong> {values.jobType}</div>
                                <div><strong>Category:</strong> {values.category}</div>
                                <div><strong>Experience:</strong> {values.experience}</div>
                                <div><strong>Salary:</strong> {values.salary}</div>
                                <div><strong>Location:</strong> {values.location}</div>
                                <div>
                                    <strong>Image Preview:</strong><br />
                                    {imagePreview ? <img src={imagePreview} alt="Preview" className="mt-2 max-w-xs" /> : "No image uploaded"}
                                </div>
                            </CardContent>
                            <CardFooter className='flex gap-2'>
                                <Button type="button" variant='outline' onClick={() => setTab("details")}>Previous</Button>
                                <Button type="submit" className="w-fit" disabled={form.formState.isSubmitting}>
                                    {form.formState.isSubmitting ? "Creating..." : "Create Job"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </form>
        </Form >
    )
}
