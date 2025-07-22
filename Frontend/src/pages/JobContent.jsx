import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useSelector } from 'react-redux';
import { BriefcaseBusiness, Calendar, MapPin, MoveRight, UserSearch, Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { toast } from "sonner"
import { APPLY_JOB_END_POINT } from '@/Constants';

const JobContent = () => {
    const navigate = useNavigate();
    const { jobId } = useParams();
    const jobs = useSelector((state) => state.jobs.jobs);
    const user = useSelector((state) => state.auth.user);
    const jobDetails = jobs.find((job) => job._id === jobId);

    const [applied, setApplied] = useState(false);
    const [timeAgo, setTimeAgo] = useState("");

    const getTimeAgo = (createdAt) => {
        const now = new Date();
        const created = new Date(createdAt);
        const diffMs = now - created;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor(diffMs / (1000 * 60));

        if (diffMinutes < 1) return "just now";
        if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
        if (diffDays === 1) return "1 day ago";
        return `${diffDays} days ago`;
    };

    const HandleCLick = async (e) => {
        e.preventDefault();

        if (!user) return navigate('/login');

        try {
            await toast.promise(
                axios.post(`${import.meta.env.VITE_BASE_URL}/${APPLY_JOB_END_POINT}/${jobId}`, {}, { withCredentials: true }),
                {
                    loading: "Applying for job...",
                    success: () => {
                        setApplied(true);
                        return "Successfully applied for the job!";
                    },
                    error: (err) => {
                        console.error(err);
                        return err?.response?.data?.message || "Failed to apply. Please try again.";
                    }
                }
            );
        } catch (err) {
            console.error("Unexpected error:", err);
        }
    };


    useEffect(() => {
        if (jobDetails?.Details?.createdAt) {
            const time = getTimeAgo(jobDetails.Details.createdAt);
            setTimeAgo(time);
        }

        if (!user || !jobDetails?.appliedUsers) {
            setApplied(false);
            return;
        }

        const hasApplied = jobDetails.appliedUsers.some((applied) => {
            const appliedUserId = applied.user?._id || applied.user;
            return appliedUserId === user._id;
        });

        setApplied(hasApplied);
    }, [jobDetails, user]);

    if (!jobDetails) return <div className="p-10 text-center text-gray-500">Job not found.</div>;

    return (
        <div className="w-8/11 mx-auto py-6">
            <h1 className="text-xl font-semibold mb-4">Job Details</h1>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                        <AvatarImage src={jobDetails.Details.image} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <p className="text-lg font-semibold">{jobDetails.jobTitle}</p>
                            <p className="bg-gray-200 text-blue-600 text-xs px-2 py-1 rounded-full">{timeAgo}</p>
                        </div>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            {jobDetails.Details.location}
                        </p>
                    </div>
                </div>
                {
                    user?.role !== "Recruiter" && (

                        <Button className="bg-blue-600 hover:bg-blue-700" disabled={applied} onClick={HandleCLick}>
                            {applied ? "Already Applied" : <>Apply Now <MoveRight className="ml-1" /></>}
                        </Button>
                    )
                }
            </div>

            <div className="flex flex-col lg:flex-row gap-8 mt-8">
                <div className="lg:w-[60%] w-full">
                    <section className="mb-6">
                        <h2 className="font-semibold mb-2">Job Description</h2>
                        <p className="text-sm text-gray-700">{jobDetails.jobDescription}</p>
                    </section>
                    <section>
                        <h2 className="font-semibold mb-2">Responsibilities</h2>
                        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                            {jobDetails.keyResponsibilities.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </section>
                </div>

                <div className="lg:w-[40%] w-full">
                    <Card>
                        <CardHeader>
                            <CardTitle>Job Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {[
                                { icon: <Calendar />, label: "Posted", value: timeAgo },
                                { icon: <Calendar />, label: "Category", value: jobDetails.Details.category },
                                { icon: <MapPin />, label: "Location", value: jobDetails.Details.location },
                                { icon: <Wallet />, label: "Salary", value: jobDetails.Details.salary },
                                { icon: <BriefcaseBusiness />, label: "Job Type", value: jobDetails.Details.jobType },
                                { icon: <UserSearch />, label: "Experience", value: jobDetails.Details.experience },
                            ].map((item, idx) => (
                                <Card key={idx} className="bg-gray-100 border border-gray-300 p-2">
                                    <div className="flex items-center gap-2 mb-1">{item.icon}</div>
                                    <p className="text-xs text-gray-500">{item.label}</p>
                                    <p className="text-sm font-medium">{item.value}</p>
                                </Card>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default JobContent;
