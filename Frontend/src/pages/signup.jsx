import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import {
    RadioGroup,
    RadioGroupItem,
} from "@/components/ui/radio-group"
import { X, CloudUpload } from "lucide-react"
import axios from "axios"
import { REGISTER_END_POINTS } from "@/Constants"
import { useNavigate } from "react-router-dom"

const signupSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    phone: z.string().regex(/^[0-9]{10}$/, "Phone must be 10 digits"),
    role: z.enum(["Student", "Recruiter"]),
    image: z
        .any()
        .refine((file) => file instanceof File && file.size > 0, "Image is required"),
})

export default function Signup() {

    const navigate = useNavigate();
    const [imagePreview, setImagePreview] = useState(null)

    const form = useForm({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            phone: "",
            role: "job-seeker",
        },
    })

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("fullName", data.name);
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("phone", data.phone);
        formData.append("role", data.role);
        formData.append("image", data.image);

        await toast.promise(
            axios.post(`${import.meta.env.VITE_BASE_URL}/${REGISTER_END_POINTS}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            }),
            {
                loading: "Registering...",
                success: () => {
                    navigate("/login");
                    form.reset({
                        name: "",
                        email: "",
                        password: "",
                        phone: "",
                        role: "job-seeker",
                    });
                    setImagePreview(null);
                    return "Account created successfully!";
                },
                error: (err) => {
                    console.error("Signup error", err);
                    return err.response?.data?.message || "Signup failed!";
                },
            }
        );
    };


    return (
        <div className="max-w-md mx-auto my-10 border rounded-xl p-6 shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="John Doe" {...field} />
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
                                <FormControl>
                                    <Input type="email" placeholder="you@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="••••••••" {...field} />
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
                                <FormControl>
                                    <Input type="tel" placeholder="9876543210" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Role</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        className="flex gap-4"
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormItem className="flex items-center space-x-2">
                                            <FormControl>
                                                <RadioGroupItem value="Student" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Job Seeker</FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-2">
                                            <FormControl>
                                                <RadioGroupItem value="Recruiter" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Recruiter</FormLabel>
                                        </FormItem>
                                    </RadioGroup>
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
                                <FormLabel>Profile Image</FormLabel>
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

                    <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? "Registering..." : "Create Account"}
                    </Button>
                </form>
            </Form>
        </div>
    )
}
