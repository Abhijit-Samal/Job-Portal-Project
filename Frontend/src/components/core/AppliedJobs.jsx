import { GET_APPLIED_JOBS_END_POINT } from '@/Constants';
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Dot, IndianRupee, MapPin, MoveRight } from 'lucide-react';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';



const AppliedJobs = () => {
  const [jobs, setjobs] = useState([]);
  const navigate = useNavigate();     
  const user = useSelector((state) => state.auth.user)
  const getAppliedJobs = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/${GET_APPLIED_JOBS_END_POINT}`, {
        withCredentials: true,
      })
      console.log(response)
      setjobs(response.data.jobs)
    }
    catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    getAppliedJobs();
  }, [])


  return (
    <div className="w-[96%] mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Applied Jobs</h2>
      {jobs.length === 0 ? (
        <p>No jobs applied yet.</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job, index) => (
            <Card key={index}>
              <CardContent className='flex items-center justify-between'>
                <div className="flex items-center gap-5">
                  <Avatar className="cursor-pointer w-12 h-12">
                    <AvatarImage src={job?.Details?.image}></AvatarImage>
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col justify-center">
                    <div className="flex gap-2">
                      <p className="font-semibold">{job?.jobTitle}</p>
                      <p className="px-2 py-1 bg-gray-200 rounded-full text-xs font-medium text-gray-600">{job?.Details?.jobType}</p>
                    </div>
                    <div className="flex ">
                      <p className="flex text-gray-600 gap-1 items-center"><MapPin width={15} />{job?.Details?.location}</p>
                      <Dot className='pt-1' />
                      <p className="flex text-gray-600 gap-1 items-center"><IndianRupee width={15} />{job?.Details?.salary}</p>
                    </div>
                  </div>
                </div>
                <div className="">
                  <Button type='button' onClick={() => navigate(`/jobs/${job?._id}`)}>View Details<MoveRight/></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </ul>
      )}
    </div>
  )
}

export default AppliedJobs