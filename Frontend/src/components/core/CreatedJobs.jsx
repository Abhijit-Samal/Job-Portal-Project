import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import axios from 'axios';
import { Edit } from 'lucide-react';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CreatedJobs = () => {
  const jobsArray = useSelector((state) => state.jobs.jobs);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const jobs = jobsArray.filter(
    (job) => job.createdBy?._id === user?._id
  );

  return (
    <div className="grid gap-4 p-4">
      {jobs.length === 0 ? (
        <div className="text-center text-muted-foreground text-lg font-medium py-10">
          No jobs available.
        </div>
      ) : (
        jobs.map((job) => (
          <Card key={job._id} className='w-90%'>
            <CardContent className="space-y-2 flex items-center justify-between gap-5">
              <div className="">
                <h2 className="text-xl font-bold">{job.jobTitle}</h2>
                <p className="text-justify">{job.jobDescription}</p>
                <div className="text-sm text-muted-foreground">
                  {job?.Details?.jobType} · {job?.Details?.location} · {job?.Details?.salary}
                </div>
              </div>
              <div className='flex flex-col'>
                <Button type="button" onClick={() => navigate(`/dashboard/jobs/created/edit/${job._id}`)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button className='mt-2' type="button" onClick={() => navigate(`/dashboard/jobs/appliedUsers/${job._id}`)}>
                  View All
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default CreatedJobs;
