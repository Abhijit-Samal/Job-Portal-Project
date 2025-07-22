import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    RadioGroup,
    RadioGroupItem,
} from "@/components/ui/radio-group"
import axios from "axios"
import { LOGIN_END_POINTS } from "@/Constants"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setUser } from "@/app/features/authSlice"

// Zod Schema
const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["Student", "Recruiter"]),
})

export default function Login() {
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            role: "job-seeker",
        },
    })

    const onSubmit = async (data) => {
        const formData = new FormData()
        formData.append("email", data.email)
        formData.append("password", data.password)
        formData.append("role", data.role)

        await toast.promise(
            axios.post(`${import.meta.env.VITE_BASE_URL}/${LOGIN_END_POINTS}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            }),
            {
                loading: "Logging in...",
                success: (response) => {
                    dispatch(setUser(response.data.user))
                    navigate("/")

                    form.reset({
                        email: "",
                        password: "",
                        role: "job-seeker",
                    })

                    return `Welcome, ${response.data.user?.fullName || "User"}!`
                },
                error: (err) => {
                    console.error("Login Error", err)
                    return err?.response?.data?.message || "Login failed. Please try again."
                }
            }
        )
    }


    return (
        <div className="max-w-md mx-auto my-10 border rounded-xl p-6 shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

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

                    <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? "Logging in..." : "Log in"}
                    </Button>
                </form>
            </Form>
        </div>
    )
}
