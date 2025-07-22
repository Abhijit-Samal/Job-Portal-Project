import { Button } from '@/components/ui/button';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserPlus, UploadCloud, Search, Send } from "lucide-react";
import axios from 'axios';
import { setJobs } from '@/app/features/jobSlice';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import herro from '../assets/hero.json'

const Home = () => {
  const jobs = useSelector((state) => state.jobs.jobs);
  const dispatch = useDispatch();

  const getAllJobs = async () => {
    try {
      const result = await axios.get(`${import.meta.env.VITE_BASE_URL}/jobs`);
      dispatch(setJobs(result.data.jobs));
    } catch (error) {
      console.error("Error loading jobs", error);
    }
  };

  useEffect(() => {
    getAllJobs();
  }, []);

  return (
    <>
      <div className='bg-gray-100 min-h-[calc(100vh-4rem)] flex justify-center items-center px-4'>
        <div className="max-w-7xl w-8/11 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="flex flex-col gap-5">
            <p className="text-4xl md:text-5xl font-bold">
              Find a job that suits your <br /> interest & skills.
            </p>
            <p className="font-light text-base text-gray-700">
              Discover thousands of job opportunities tailored to your preferences. Connect with recruiters and take your career to the next level.
            </p>
            <div className="w-fit">
              <Link to="/jobs">
                <Button>Explore Jobs</Button>
              </Link>
            </div>
          </div>
          <div className="hidden md:flex justify-center">
            <Lottie animationData={herro}/>
          </div>
        </div>
      </div>

      <section className="bg-white py-12 px-4">
        <div className="max-w-6xl w-8/11 mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-8">Why Choose Us?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 border rounded-xl shadow-sm">
              <Search size={40} className="mx-auto text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Find Jobs Easily</h3>
              <p className="text-gray-600">Browse jobs from top companies with detailed filters and intelligent search options.</p>
            </div>
            <div className="p-6 border rounded-xl shadow-sm">
              <UploadCloud size={40} className="mx-auto text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Upload Resume</h3>
              <p className="text-gray-600">Store and manage your resume. Apply with a single click.</p>
            </div>
            <div className="p-6 border rounded-xl shadow-sm">
              <UserPlus size={40} className="mx-auto text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Get Noticed</h3>
              <p className="text-gray-600">Get personalized job suggestions and recruiter messages.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-10 px-4">
        <div className="max-w-6xl w-8/11 mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-center">Latest Jobs</h2>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {jobs?.slice(0, 6).map((job) => (
              <div key={job._id} className="p-5 bg-white border rounded-lg shadow-sm flex flex-col justify-between">
                <h3 className="text-lg font-semibold">{job.jobTitle}</h3>
                <div className=""><p className="text-sm text-gray-600 mt-1">{job?.Details?.category}</p>
                <p className="text-sm text-gray-500 mt-1">{job?.Details?.salary}</p></div>
                <Link to={`/jobs/${job._id}`}>
                  <Button className="mt-4 w-full">View</Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

    </>
  );
};

export default Home;
